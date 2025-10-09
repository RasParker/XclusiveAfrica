import express from 'express';
import multer from 'multer';
import { CloudinaryService, isCloudinaryEnabled } from '../services/cloudinaryService';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|webp|heic/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Supported formats: JPEG, PNG, GIF, WebP, HEIC, MP4, MOV'));
    }
  }
});

const checkCloudinaryEnabled = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!isCloudinaryEnabled) {
    return res.status(503).json({ 
      success: false, 
      error: 'Cloudinary is not configured',
      message: 'Media upload via Cloudinary is currently unavailable. Please configure CLOUDINARY_URL environment variable or use local file uploads.'
    });
  }
  next();
};

router.post('/profile-photo', checkCloudinaryEnabled, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!req.session?.userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    console.log('Uploading profile photo to Cloudinary for user:', req.session.userId);
    
    const uploadResult = await CloudinaryService.uploadProfileImage(
      req.file.buffer,
      req.file.mimetype,
      req.session.userId,
      'avatar'
    );

    await db.update(users)
      .set({ avatar: uploadResult.secure_url })
      .where(eq(users.id, req.session.userId));

    console.log('Profile photo uploaded successfully:', uploadResult.secure_url);

    res.json({ 
      success: true, 
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      message: 'Profile photo uploaded successfully' 
    });
  } catch (error) {
    console.error('Profile photo upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to upload profile photo' 
    });
  }
});

router.post('/cover-photo', checkCloudinaryEnabled, upload.single('coverPhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!req.session?.userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    console.log('Uploading cover photo to Cloudinary for user:', req.session.userId);
    
    const uploadResult = await CloudinaryService.uploadProfileImage(
      req.file.buffer,
      req.file.mimetype,
      req.session.userId,
      'cover'
    );

    await db.update(users)
      .set({ cover_image: uploadResult.secure_url })
      .where(eq(users.id, req.session.userId));

    console.log('Cover photo uploaded successfully:', uploadResult.secure_url);

    res.json({ 
      success: true, 
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      message: 'Cover photo uploaded successfully' 
    });
  } catch (error) {
    console.error('Cover photo upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to upload cover photo' 
    });
  }
});

router.post('/post-media', checkCloudinaryEnabled, upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log('Uploading post media to Cloudinary for user:', req.session.userId);
    
    const isVideo = req.file.mimetype.startsWith('video/');
    const mediaType = isVideo ? 'video' : 'image';
    
    const uploadResult = await CloudinaryService.uploadPostMedia(
      req.file.buffer,
      req.file.mimetype,
      req.session.userId,
      mediaType
    );

    console.log('Post media uploaded successfully:', uploadResult.secure_url);

    res.json({ 
      success: true, 
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      media_type: mediaType,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration,
      format: uploadResult.format,
      message: "Media uploaded successfully" 
    });
  } catch (error) {
    console.error('Post media upload error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to upload media" 
    });
  }
});

router.post('/post-media-multiple', checkCloudinaryEnabled, upload.array('media', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log(`Uploading ${files.length} media files to Cloudinary for user:`, req.session.userId);
    
    const uploadPromises = files.map(async (file) => {
      const isVideo = file.mimetype.startsWith('video/');
      const mediaType = isVideo ? 'video' : 'image';
      
      return CloudinaryService.uploadPostMedia(
        file.buffer,
        file.mimetype,
        req.session.userId!,
        mediaType
      );
    });

    const uploadResults = await Promise.all(uploadPromises);

    console.log('Multiple media files uploaded successfully');

    res.json({ 
      success: true, 
      uploads: uploadResults.map(result => ({
        url: result.secure_url,
        public_id: result.public_id,
        media_type: result.resource_type,
        width: result.width,
        height: result.height,
        duration: result.duration,
        format: result.format
      })),
      message: `${files.length} files uploaded successfully` 
    });
  } catch (error) {
    console.error('Multiple media upload error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to upload media files" 
    });
  }
});

router.delete('/media/:publicId', checkCloudinaryEnabled, async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { publicId } = req.params;
    const { resourceType = 'image' } = req.query;

    const deleted = await CloudinaryService.deleteMedia(
      publicId,
      req.session.userId!,
      resourceType as 'image' | 'video'
    );

    if (deleted) {
      res.json({ 
        success: true, 
        message: 'Media deleted successfully' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Media not found or already deleted' 
      });
    }
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to delete media" 
    });
  }
});

router.post('/signed-url', checkCloudinaryEnabled, async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { folder, publicId } = req.body;
    const userFolder = folder || `users/${req.session.userId}`;

    const signedUrl = CloudinaryService.generateSignedUploadUrl(userFolder, publicId);

    res.json({ 
      success: true, 
      ...signedUrl 
    });
  } catch (error) {
    console.error('Generate signed URL error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to generate signed URL" 
    });
  }
});

export default router;
