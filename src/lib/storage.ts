import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { query } from '@/lib/db';

export interface StorageUploadResult {
  id: number;
  filename: string;
  url: string;
  storageProvider: 'database' | 'cloudinary' | 'vercel_blob';
  mimeType: string;
  size: number;
  originalName: string;
}

export interface StorageFileFetchResult {
  buffer?: Buffer;
  mimeType?: string;
  size?: number;
  redirectUrl?: string;
}

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

/**
 * Upload a file to Cloudinary via REST API without third-party dependencies.
 */
async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  category: string
): Promise<{ url: string } | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'prashant_pathak_puja';
  const publicId = path.parse(filename).name;

  // Cloudinary signature generation
  // Signature is sha1 of sorted parameters concatenated with api_secret
  const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const resourceType = mimeType.startsWith('video/') ? 'video' : 'image';
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  formData.append('file', blob, filename);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('signature', signature);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[STORAGE-CLOUDINARY-FAIL]', res.status, errorText);
    return null;
  }

  const data = await res.json();
  return { url: data.secure_url || data.url };
}

/**
 * Upload a file to Vercel Blob via standard REST API.
 */
async function uploadToVercelBlob(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<{ url: string } | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  const endpoint = `https://blob.vercel-storage.com/${filename}`;
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-content-type': mimeType,
      'x-add-random-suffix': 'false',
    },
    body: new Uint8Array(buffer),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[STORAGE-VERCEL-BLOB-FAIL]', res.status, errorText);
    return null;
  }

  const data = await res.json();
  return { url: data.url };
}

/**
 * Centralized file upload processor supporting Cloudinary, Vercel Blob,
 * and resilient PostgreSQL Database Storage fallback.
 */
export async function uploadMediaFile({
  buffer,
  filename,
  originalName,
  mimeType,
  category = 'general',
}: {
  buffer: Buffer;
  filename: string;
  originalName: string;
  mimeType: string;
  category?: string;
}): Promise<StorageUploadResult> {
  let finalUrl = `/api/uploads/${filename}`;
  let provider: 'database' | 'cloudinary' | 'vercel_blob' = 'database';
  let fileDataForDb: Buffer | null = buffer;

  // 1. Try Cloudinary if configured
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    try {
      const cloudRes = await uploadToCloudinary(buffer, filename, mimeType, category);
      if (cloudRes?.url) {
        finalUrl = cloudRes.url;
        provider = 'cloudinary';
        fileDataForDb = null; // Stored permanently in Cloudinary
      }
    } catch (err) {
      console.warn('[STORAGE] Cloudinary upload failed, falling back to database storage', err);
    }
  }

  // 2. Try Vercel Blob if Cloudinary wasn't used and token is present
  if (provider === 'database' && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blobRes = await uploadToVercelBlob(buffer, filename, mimeType);
      if (blobRes?.url) {
        finalUrl = blobRes.url;
        provider = 'vercel_blob';
        fileDataForDb = null; // Stored permanently in Vercel Blob
      }
    } catch (err) {
      console.warn('[STORAGE] Vercel Blob upload failed, falling back to database storage', err);
    }
  }

  // 3. Optional local disk caching (gracefully ignore read-only filesystems on Vercel)
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    const localPath = path.join(UPLOAD_DIR, filename);
    if (localPath.startsWith(UPLOAD_DIR)) {
      fs.writeFileSync(localPath, buffer);
    }
  } catch (diskErr) {
    // Expected on serverless Vercel lambda (read-only filesystem)
    // Safe to ignore since data is permanently preserved in PostgreSQL or Cloud!
  }

  // 4. Record metadata (and byte data if database provider) in PostgreSQL
  const mediaRes = await query(
    `
    INSERT INTO media (
      filename, original_name, mime_type, file_size, category, url, file_data, storage_provider
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, filename, url, storage_provider, mime_type, file_size, original_name
    `,
    [
      filename,
      originalName.slice(0, 200),
      mimeType,
      buffer.length,
      category,
      finalUrl,
      fileDataForDb,
      provider,
    ]
  );

  const row = mediaRes.rows[0];
  return {
    id: row.id,
    filename: row.filename,
    url: row.url,
    storageProvider: row.storage_provider,
    mimeType: row.mime_type,
    size: row.file_size,
    originalName: row.original_name,
  };
}

/**
 * Retrieve a file from persistent storage (PostgreSQL Database, Local Disk, or Remote Redirect).
 */
export async function getFileFromStorage(filename: string): Promise<StorageFileFetchResult | null> {
  // Check Database first
  try {
    const res = await query(
      `SELECT file_data, mime_type, file_size, url, storage_provider FROM media WHERE filename = $1 LIMIT 1`,
      [filename]
    );

    if (res.rows.length > 0) {
      const row = res.rows[0];

      // If stored externally (Cloudinary or Vercel Blob)
      if (row.url && (row.url.startsWith('http://') || row.url.startsWith('https://'))) {
        return { redirectUrl: row.url };
      }

      // If stored in database as BYTEA
      if (row.file_data) {
        return {
          buffer: Buffer.from(row.file_data),
          mimeType: row.mime_type || 'application/octet-stream',
          size: row.file_size || row.file_data.length,
        };
      }
    }
  } catch (dbErr) {
    console.error('[STORAGE-FETCH-DB-ERR]', dbErr);
  }

  // Fallback to local filesystem (e.g. legacy files or local development)
  try {
    const localPath = path.join(UPLOAD_DIR, filename);
    if (localPath.startsWith(UPLOAD_DIR) && fs.existsSync(localPath)) {
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
      else if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.webp') mimeType = 'image/webp';
      else if (ext === '.gif') mimeType = 'image/gif';
      else if (ext === '.svg') mimeType = 'image/svg+xml';
      else if (ext === '.mp4') mimeType = 'video/mp4';
      else if (ext === '.webm') mimeType = 'video/webm';

      const buffer = fs.readFileSync(localPath);
      return {
        buffer,
        mimeType,
        size: buffer.length,
      };
    }
  } catch (fsErr) {
    console.error('[STORAGE-FETCH-FS-ERR]', fsErr);
  }

  return null;
}
