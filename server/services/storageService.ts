/**
 * Pluggable Storage Abstraction
 * Supports Local Base64/Disk fallback for free prototyping,
 * with a standardized interface ready to bind Supabase Storage or S3.
 */

export interface StorageUploadResult {
  url: string;
  key: string;
  mimeType: string;
  sizeBytes: number;
  fileName: string;
}

export interface IStorageService {
  uploadFile(
    fileBuffer: Buffer | string,
    fileName: string,
    mimeType: string,
    folder?: string
  ): Promise<StorageUploadResult>;
  deleteFile(key: string): Promise<boolean>;
  getPublicUrl(key: string): string;
}

/**
 * Free-tier memory/data-uri storage service.
 * Ideal for hackathons & instant local dev without paying or requiring S3 credentials.
 */
export class FreePrototypeStorageService implements IStorageService {
  private inMemoryFiles = new Map<string, { data: string; mimeType: string; fileName: string; size: number }>();

  async uploadFile(
    fileBuffer: Buffer | string,
    fileName: string,
    mimeType: string,
    folder: string = 'challenges'
  ): Promise<StorageUploadResult> {
    const key = `${folder}/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    let dataUri: string;
    let sizeBytes = 0;

    if (Buffer.isBuffer(fileBuffer)) {
      dataUri = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
      sizeBytes = fileBuffer.length;
    } else if (typeof fileBuffer === 'string') {
      if (fileBuffer.startsWith('data:')) {
        dataUri = fileBuffer;
        sizeBytes = Math.round((fileBuffer.length * 3) / 4);
      } else {
        dataUri = `data:${mimeType};base64,${Buffer.from(fileBuffer).toString('base64')}`;
        sizeBytes = fileBuffer.length;
      }
    } else {
      throw new Error('Unsupported file payload format.');
    }

    this.inMemoryFiles.set(key, { data: dataUri, mimeType, fileName, size: sizeBytes });

    return {
      url: dataUri,
      key,
      mimeType,
      sizeBytes,
      fileName,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    return this.inMemoryFiles.delete(key);
  }

  getPublicUrl(key: string): string {
    const item = this.inMemoryFiles.get(key);
    return item ? item.data : '';
  }
}

export const storageService = new FreePrototypeStorageService();
