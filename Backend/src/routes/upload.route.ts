import express, { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import jwt from "jsonwebtoken";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Middleware to verify admin token
const verifyAdmin = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('Admin upload failed: No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    if (decoded.role !== 'admin') {
      console.error('Admin upload failed: Not authorized - role:', decoded.role);
      return res.status(403).json({ message: 'Not authorized' });
    }
    (req as any).admin = decoded;
    next();
  } catch (error) {
    console.error('Admin upload failed: Invalid token', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Upload image to Cloudinary
router.post('/image', verifyAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    console.log('Admin upload request received');
    if (!req.file) {
      console.error('Admin upload failed: No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log('Uploading to Cloudinary...');
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'e-learning/courses',
      resource_type: 'auto',
    });

    console.log('Cloudinary upload successful:', result.secure_url);
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
      imageData: dataURI, // Also return base64 for storage
    });
  } catch (error) {
    console.error('Admin upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: (error as Error).message });
  }
});

// Delete image from Cloudinary
router.delete('/image/:publicId', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Delete failed', error: (error as Error).message });
  }
});

export default router;
