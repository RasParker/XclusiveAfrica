import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variable
if (!process.env.CLOUDINARY_URL) {
  throw new Error('CLOUDINARY_URL environment variable is required');
}

// Parse API secret from CLOUDINARY_URL for signed operations
function parseCloudinaryUrl(url: string) {
  const regex = /cloudinary:\/\/(\d+):([^@]+)@([^\/]+)/;
  const match = url.match(regex);
  if (!match) {
    throw new Error('Invalid CLOUDINARY_URL format');
  }
  return {
    api_key: match[1],
    api_secret: match[2],
    cloud_name: match[3]
  };
}

const cloudinaryConfig = parseCloudinaryUrl(process.env.CLOUDINARY_URL);

// Cloudinary automatically configures itself from the CLOUDINARY_URL
console.log('Cloudinary configured successfully');

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
  /**
   * Upload an image with optimizations
   */
  static async uploadImage(file: Buffer, mimeType: string, options: {
    folder?: string;
    public_id?: string;
    transformation?: any;
  } = {}): Promise<UploadResult> {
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

  /**
   * Upload a video with optimizations
   */
  static async uploadVideo(file: Buffer, mimeType: string, options: {
    folder?: string;
    public_id?: string;
  } = {}): Promise<UploadResult> {
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

  /**
   * Upload profile image with specific transformations
   */
  static async uploadProfileImage(file: Buffer, mimeType: string, userId: number, type: 'avatar' | 'cover'): Promise<UploadResult> {
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

  /**
   * Upload post media with optimizations
   */
  static async uploadPostMedia(file: Buffer, mimeType: string, creatorId: number, mediaType: 'image' | 'video'): Promise<UploadResult> {
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

  /**
   * Delete a media file from Cloudinary (with ownership verification)
   */
  static async deleteMedia(publicId: string, userId: number, resourceType: 'image' | 'video' = 'image'): Promise<boolean> {
    try {
      // Check if publicId belongs to the user (should start with users/{userId}/ or posts/{userId}/)
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

  /**
   * Generate a signed URL for direct upload from frontend
   */
  static generateSignedUploadUrl(folder: string, publicId?: string): {
    url: string;
    signature: string;
    timestamp: number;
    api_key: string;
  } {
    const timestamp = Math.round(Date.now() / 1000);
    const params = {
      timestamp,
      folder,
      ...(publicId && { public_id: publicId })
    };

    const signature = cloudinary.utils.api_sign_request(params, cloudinaryConfig.api_secret);

    return {
      url: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`,
      signature,
      timestamp,
      api_key: cloudinaryConfig.api_key
    };
  }
}