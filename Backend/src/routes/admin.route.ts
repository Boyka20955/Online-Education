import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model';
import { User } from '../models/user.model';
import Course from '../models/course.model';
import Pricing from '../models/pricing.model';
import Purchase from '../models/purchase.model'; // For Purchased Courses tab
import Paid from '../models/Paid.model'; // For Purchases tab

const router = express.Router();

// Admin login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (username !== 'Boyka00' || password !== 'Boyka254') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if admin exists, if not create it
    let admin = await Admin.findOne({ username });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = new Admin({ username, password: hashedPassword });
      await admin.save();
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin._id, username: admin.username }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify admin token
const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    (req as any).admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all users
router.get('/users', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Course Management Routes
router.get('/courses', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/courses', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/courses/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/courses/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Pricing Management Routes
router.get('/pricing', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const pricing = await Pricing.find();
    res.json(pricing);
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/pricing', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const pricing = new Pricing(req.body);
    await pricing.save();
    res.status(201).json(pricing);
  } catch (error) {
    console.error('Create pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/pricing/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const pricing = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pricing) {
      return res.status(404).json({ message: 'Pricing plan not found' });
    }
    res.json(pricing);
  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/pricing/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const pricing = await Pricing.findByIdAndDelete(req.params.id);
    if (!pricing) {
      return res.status(404).json({ message: 'Pricing plan not found' });
    }
    res.json({ message: 'Pricing plan deleted successfully' });
  } catch (error) {
    console.error('Delete pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== PURCHASED COURSES ROUTES (Purchase Model) ==========
router.get('/purchased-courses', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const purchasedCourses = await Purchase.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(purchasedCourses);
  } catch (error) {
    console.error('Get purchased courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/purchased-courses', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { id, title, instructor, text, img, userId, message, link } = req.body;

    // Validate required fields
    if (!title || !instructor || !text || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const purchasedCourse = new Purchase({
      id: id || Math.floor(100000 + Math.random() * 900000), // Generate ID if not provided
      title,
      instructor,
      text,
      img,
      userId,
      message,
      link
    });

    await purchasedCourse.save();

    // Populate the response with user details
    const populatedPurchase = await Purchase.findById(purchasedCourse._id)
      .populate('userId', 'name email');

    res.status(201).json(populatedPurchase);
  } catch (error) {
    console.error('Create purchased course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/purchased-courses/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { title, instructor, text, img, userId, message, link } = req.body;

    const purchasedCourse = await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        title,
        instructor,
        text,
        img,
        userId,
        message,
        link
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!purchasedCourse) {
      return res.status(404).json({ message: 'Purchased course not found' });
    }

    res.json(purchasedCourse);
  } catch (error) {
    console.error('Update purchased course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/purchased-courses/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const purchasedCourse = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchasedCourse) {
      return res.status(404).json({ message: 'Purchased course not found' });
    }
    res.json({ message: 'Purchased course deleted successfully' });
  } catch (error) {
    console.error('Delete purchased course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== PURCHASES ROUTES (Paid Model) ==========
router.get('/purchases', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const purchases = await Paid.find()
      .populate('userId', 'name email')
      .populate('paidCourse', 'title instructor')
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/purchases', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { userId, paidCourse, amount, phoneNumber, mpesaMessage, status } = req.body;

    // Validate required fields
    if (!userId || !paidCourse || !amount || !phoneNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const purchase = new Paid({
      userId,
      paidCourse,
      amount,
      phoneNumber,
      mpesaMessage: mpesaMessage || `Admin created purchase`,
      status: status || 'paid'
    });

    await purchase.save();

    // Populate the response with user and course details
    const populatedPurchase = await Paid.findById(purchase._id)
      .populate('userId', 'name email')
      .populate('paidCourse', 'title instructor');

    res.status(201).json(populatedPurchase);
  } catch (error) {
    console.error('Create purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/purchases/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { userId, paidCourse, amount, phoneNumber, mpesaMessage, status } = req.body;

    const purchase = await Paid.findByIdAndUpdate(
      req.params.id,
      {
        userId,
        paidCourse,
        amount,
        phoneNumber,
        mpesaMessage,
        status
      },
      { new: true }
    ).populate('userId', 'name email')
     .populate('paidCourse', 'title instructor');

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    res.json(purchase);
  } catch (error) {
    console.error('Update purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/purchases/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const purchase = await Paid.findByIdAndDelete(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error('Delete purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;