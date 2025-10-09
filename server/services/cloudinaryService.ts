import { v2 as cloudinary } from 'cloudinary';

let cloudinaryConfig: {
  api_key: string;
  api_secret: string;
  cloud_name: string;
} | null = null;

let isConfigured = false;

if (process.env.CLOUDINARY_URL) {
  try {
    const url = process.env.CLOUDINARY_URL;
    const regex = /cloudinary:\/\/(\d+):([^@]+)@([^\/]+)/;
    const match = url.match(regex);
    
    if (!match) {
      console.error('Invalid CLOUDINARY_URL format. Cloudinary features will be disabled.');
    } else {
      cloudinaryConfig = {
        api_key: match[1],
        api_secret: match[2],
        cloud_name: match[3]
      };
      isConfigured = true;
      console.log('Cloudinary configured successfully');
    }
  } catch (error) {
    console.error('Failed to configure Cloudinary:', error);
  }
} else {
  console.warn('CLOUDINARY_URL not set. Cloudinary features are disabled. Media uploads will use local storage.');
}

export const isCloudinaryEnabled = isConfigured;

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: 'image' | 'video' | 'raw';
  bytes: number;
  duration?: number;
}

export class CloudinaryService {
  private static ensureEnabled(): void {
    if (!isCloudinaryEnabled || !cloudinaryConfig) {
      throw new Error('Cloudinary is not configured. Please set CLOUDINARY_URL environment variable.');
    }
  }

  static async uploadImage(file: Buffer, mimeType: string, options: {
    folder?: string;
    public_id?: string;
    transformation?: any;
  } = {}): Promise<UploadResult> {
    this.ensureEnabled();
    
    try {
      const result = await cloudinary.uploader.upload(`data:${mimeType};base64,${file.toString('base64')}`, {
        folder: options.folder || 'uploads',
        public_id: options.public_id,
        transformation: options.transformation || [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ],
        resource_type: 'image'
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: 'image',
        bytes: result.bytes
      };
    } catch (error) {
      console.error('Cloudinary image upload error:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async uploadVideo(file: Buffer, mimeType: string, options: {
    folder?: string;
    public_id?: string;
  } = {}): Promise<UploadResult> {
    this.ensureEnabled();
    
    try {
      const result = await cloudinary.uploader.upload(`data:${mimeType};base64,${file.toString('base64')}`, {
        folder: options.folder || 'uploads/videos',
        public_id: options.public_id,
        resource_type: 'video',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: 'video',
        bytes: result.bytes,
        duration: result.duration
      };
    } catch (error) {
      console.error('Cloudinary video upload error:', error);
      throw new Error(`Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async uploadProfileImage(file: Buffer, mimeType: string, userId: number, type: 'avatar' | 'cover'): Promise<UploadResult> {
    this.ensureEnabled();
    
    const transformations = type === 'avatar' 
      ? [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      : [
          { width: 1200, height: 400, crop: 'fill' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ];

    return this.uploadImage(file, mimeType, {
      folder: `users/${userId}`,
      public_id: `${type}_${Date.now()}`,
      transformation: transformations
    });
  }

  static async uploadPostMedia(file: Buffer, mimeType: string, creatorId: number, mediaType: 'image' | 'video'): Promise<UploadResult> {
    this.ensureEnabled();
    
    const folder = `posts/${creatorId}`;
    
    if (mediaType === 'video') {
      return this.uploadVideo(file, mimeType, { folder });
    } else {
      return this.uploadImage(file, mimeType, {
        folder,
        transformation: [
          { width: 1080, height: 1080, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });
    }
  }

  static async deleteMedia(publicId: string, userId: number, resourceType: 'image' | 'video' = 'image'): Promise<boolean> {
    this.ensureEnabled();
    
    try {
      const userPrefixes = [`users/${userId}/`, `posts/${userId}/`];
      const hasValidPrefix = userPrefixes.some(prefix => publicId.startsWith(prefix));
      
      if (!hasValidPrefix) {
        console.warn(`Unauthorized delete attempt: User ${userId} tried to delete ${publicId}`);
        return false;
      }

      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return false;
    }
  }

  static generateSignedUploadUrl(folder: string, publicId?: string): {
    url: string;
    signature: string;
    timestamp: number;
    api_key: string;
  } {
    this.ensureEnabled();
    
    const timestamp = Math.round(Date.now() / 1000);
    const params = {
      timestamp,
      folder,
      ...(publicId && { public_id: publicId })
    };

    const signature = cloudinary.utils.api_sign_request(params, cloudinaryConfig!.api_secret);

    return {
      url: `https://api.cloudinary.com/v1_1/${cloudinaryConfig!.cloud_name}/image/upload`,
      signature,
      timestamp,
      api_key: cloudinaryConfig!.api_key
    };
  }
}
