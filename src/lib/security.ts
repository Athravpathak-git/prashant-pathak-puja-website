import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Rate Limiter Storage
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export function checkRateLimit(
  req: NextRequest,
  actionKey: string,
  limit: number,
  windowSeconds: number
): { allowed: boolean; remaining: number; retryAfter?: number } {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const key = `${actionKey}:${ip}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

/**
 * XSS Sanitizer: strips HTML tags and script injections
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/on\w+\s*=/gi, '') // remove inline handlers
    .trim();
}

/**
 * Validates magic bytes and file signatures for both image and video uploads
 */
export function validateMediaMagicBytes(buffer: Buffer): {
  valid: boolean;
  type: 'image' | 'video' | null;
  ext: string | null;
  mime: string | null;
} {
  if (!buffer || buffer.length < 4) {
    return { valid: false, type: null, ext: null, mime: null };
  }

  // 1. JPEG: FF D8 FF
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, type: 'image', ext: 'jpg', mime: 'image/jpeg' };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, type: 'image', ext: 'png', mime: 'image/png' };
  }

  // 3. WEBP: 'RIFF' .... 'WEBP'
  if (buffer.length >= 12) {
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;
    if (isRiff && isWebp) {
      return { valid: true, type: 'image', ext: 'webp', mime: 'image/webp' };
    }
  }

  // 4. GIF: 'GIF87a' or 'GIF89a'
  if (buffer.length >= 6 && buffer.subarray(0, 4).toString('ascii') === 'GIF8') {
    return { valid: true, type: 'image', ext: 'gif', mime: 'image/gif' };
  }

  // 5. ICO: 00 00 01 00
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x00 &&
    buffer[1] === 0x00 &&
    buffer[2] === 0x01 &&
    buffer[3] === 0x00
  ) {
    return { valid: true, type: 'image', ext: 'ico', mime: 'image/x-icon' };
  }

  // 6. MP4 / M4V / QuickTime: offset 4 'ftyp' or 'moov'
  if (buffer.length >= 8) {
    const brand = buffer.subarray(4, 8).toString('ascii');
    if (brand === 'ftyp' || brand === 'moov') {
      return { valid: true, type: 'video', ext: 'mp4', mime: 'video/mp4' };
    }
  }

  // 7. WebM / Matroska: 1A 45 DF A3 (EBML)
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  ) {
    return { valid: true, type: 'video', ext: 'webm', mime: 'video/webm' };
  }

  // 8. SVG: safe XML / SVG detection
  const sample = buffer.subarray(0, 1024).toString('utf8').trim();
  if (sample.includes('<svg') && !sample.includes('<script') && !sample.includes('javascript:')) {
    return { valid: true, type: 'image', ext: 'svg', mime: 'image/svg+xml' };
  }

  return { valid: false, type: null, ext: null, mime: null };
}

/**
 * Validates magic bytes for image uploads (backwards compatibility)
 */
export function validateImageMagicBytes(buffer: Buffer): { valid: boolean; ext: string | null } {
  const res = validateMediaMagicBytes(buffer);
  if (res.valid && res.type === 'image') {
    return { valid: true, ext: res.ext };
  }
  return { valid: false, ext: null };
}

/**
 * Generate unpredictable random filename
 */
export function generateSafeFileName(ext: string): string {
  const randomHex = crypto.randomBytes(16).toString('hex');
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${Date.now()}_${randomHex}.${safeExt}`;
}

/**
 * Generate Booking Reference ID, e.g. PUJA-2026-XXXXXX
 */
export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `PUJA-${year}-${randomNum}`;
}
