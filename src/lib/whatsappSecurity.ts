import crypto from 'crypto';

/**
 * Derives a 256-bit (32-byte) key for AES-256-GCM.
 * Prioritizes WHATSAPP_ENCRYPTION_KEY server environment variable.
 * Fallbacks securely to JWT_SECRET + dedicated salt so runtime never crashes.
 */
function getEncryptionKey(): Buffer {
  const customKey = process.env.WHATSAPP_ENCRYPTION_KEY?.trim();
  if (customKey && customKey.length > 0) {
    return crypto.createHash('sha256').update(customKey).digest();
  }
  const fallbackSecret = process.env.JWT_SECRET || 'prashant_pathak_guruji_default_salt_2026';
  return crypto.createHash('sha256').update(`whatsapp_vault_v1_${fallbackSecret}`).digest();
}

/**
 * Encrypts contact information at rest using AES-256-GCM authenticated encryption.
 * Output format: `ivHex:authTagHex:ciphertextHex`
 */
export function encryptWhatsAppContact(plainText: string): string {
  if (!plainText || plainText.trim() === '') return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // NIST recommended 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText.trim(), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts contact information at rest using AES-256-GCM authenticated decryption.
 * Verifies authenticity tag. If data is tampered or corrupted, fails safely.
 */
export function decryptWhatsAppContact(encryptedString: string): string {
  if (!encryptedString || !encryptedString.includes(':')) return '';
  const parts = encryptedString.split(':');
  if (parts.length !== 3) return '';

  const [ivHex, tagHex, cipherHex] = parts;
  if (!ivHex || !tagHex || !cipherHex) return '';

  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const cipherBuffer = Buffer.from(cipherHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(cipherBuffer), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err: any) {
    console.error('[WHATSAPP-SECURITY] Decryption failed or auth tag mismatch:', err.message);
    return '';
  }
}

export interface WhatsAppValidationResult {
  valid: boolean;
  cleanValue: string;
  cleanCountryCode: string;
  error?: string;
}

/**
 * Validates contact input according to official WhatsApp specifications.
 */
export function validateWhatsAppContact(
  type: 'mobile' | 'username',
  value: string,
  countryCode: string = '91'
): WhatsAppValidationResult {
  const cleanCC = countryCode.replace(/[^0-9]/g, '') || '91';

  if (type === 'mobile') {
    let digits = value.replace(/[^0-9]/g, '');

    if (!cleanCC || cleanCC.length < 1 || cleanCC.length > 4) {
      return {
        valid: false,
        cleanValue: '',
        cleanCountryCode: cleanCC,
        error: 'अवैध कंट्री कोड. कृपया १ ते ४ अंकी योग्य कंट्री कोड टाका (उदा. 91). / Invalid country code.',
      };
    }

    // If user redundantly included the country code inside the phone number input, normalize it
    if (digits.startsWith(cleanCC) && digits.length >= cleanCC.length + 7) {
      digits = digits.slice(cleanCC.length);
    }

    if (!digits || digits.length < 7 || digits.length > 15) {
      return {
        valid: false,
        cleanValue: '',
        cleanCountryCode: cleanCC,
        error: 'अवैध मोबाईल क्रमांक. कृपया ७ ते १५ अंकी मोबाईल नंबर टाका (उदा. 9822123456). / Invalid mobile number length.',
      };
    }

    return {
      valid: true,
      cleanValue: digits,
      cleanCountryCode: cleanCC,
    };
  }

  if (type === 'username') {
    const cleanUser = value.trim().replace(/^@+/, '');

    // WhatsApp username validation: 3-30 chars, alphanumeric + dots/underscores, no consecutive dots
    if (
      !cleanUser ||
      !/^[a-zA-Z0-9._]{3,30}$/.test(cleanUser) ||
      cleanUser.startsWith('.') ||
      cleanUser.endsWith('.') ||
      cleanUser.includes('..')
    ) {
      return {
        valid: false,
        cleanValue: '',
        cleanCountryCode: '',
        error: 'अवैध व्हॉट्सॲप युझरनेम. युझरनेममध्ये केवळ ३ ते ३० अक्षरे, अंक, डॉट (.) किंवा अंडरस्कोर (_) असू शकतात. / Invalid WhatsApp username.',
      };
    }

    return {
      valid: true,
      cleanValue: cleanUser,
      cleanCountryCode: '',
    };
  }

  return {
    valid: false,
    cleanValue: '',
    cleanCountryCode: '',
    error: 'अवैध संपर्क प्रकार निवडला आहे. / Invalid contact type.',
  };
}

/**
 * Generates official, supported WhatsApp direct chat URL.
 * Never includes +, spaces, or hyphens in the number portion.
 */
export function buildWhatsAppDirectUrl(
  type: 'mobile' | 'username',
  decryptedValue: string,
  countryCode: string = '91',
  text?: string
): string {
  if (!decryptedValue || decryptedValue.trim() === '') {
    return '';
  }

  let destination = '';
  if (type === 'mobile') {
    const cleanCC = countryCode.replace(/[^0-9]/g, '') || '91';
    const digits = decryptedValue.replace(/[^0-9]/g, '');
    destination = `https://wa.me/${cleanCC}${digits}`;
  } else {
    const cleanUser = decryptedValue.trim().replace(/^@+/, '');
    destination = `https://wa.me/${cleanUser}`;
  }

  if (text && text.trim().length > 0) {
    destination += `?text=${encodeURIComponent(text.trim())}`;
  }

  return destination;
}
