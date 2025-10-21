import express, { Request, Response } from 'express';
import Paid from '../models/Paid.model';
import Course from '../models/course.model';
import { verifyToken } from '../middleware/verifyToken';
import { sendPurchaseConfirmationEmail } from '../mailtrap/emails';
import { User } from '../models/user.model'; // Import User model for typing

const router = express.Router();

// Define types for populated documents
interface PopulatedUser {
  _id: string;
  email: string;
  name: string;
}

interface PopulatedCourse {
  _id: string;
  title: string;
  instructor: string;
}

interface PopulatedPurchase {
  _id: string;
  userId: PopulatedUser;
  paidCourse: PopulatedCourse;
  amount: number;
  phoneNumber: string;
  mpesaMessage: string;
  status: string;
  transactionId?: string;
  save(): Promise<any>;
}

// Get user's purchased courses
router.get('/purchases', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const purchases = await Paid.find({ userId, status: 'paid' })
      .populate('paidCourse', 'title instructor')
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new purchase (called after successful STK push) - This can be removed now since we create in stkpush
router.post('/purchase', verifyToken, async (req: Request, res: Response) => {
  try {
    const { courseName, amount, phoneNumber, transactionId } = req.body;
    const userId = (req as any).userId;

    // Find the course by title to get the course ID
    const course = await Course.findOne({ title: courseName });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const purchase = new Paid({
      userId,
      paidCourse: course._id,
      amount,
      phoneNumber,
      mpesaMessage: `Payment initiated for ${courseName}`,
      status: 'unpaid',
      transactionId
    });

    await purchase.save();
    res.json({ message: 'Purchase initiated', purchaseId: purchase._id });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update purchase status (called from callback)
router.post('/callback', async (req: Request, res: Response) => {
  try {
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = req.body.Body.stkCallback;

    console.log("Callback received:", {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc
    });

    // Find the purchase by transactionId with proper typing
    const purchase = await Paid.findOne({ transactionId: CheckoutRequestID })
      .populate<{ userId: PopulatedUser }>('userId', 'email name')
      .populate<{ paidCourse: PopulatedCourse }>('paidCourse', 'title instructor') as unknown as PopulatedPurchase;

    if (!purchase) {
      console.error('Purchase not found for transaction:', CheckoutRequestID);
      return res.status(404).json({ message: 'Purchase not found' });
    }

    if (ResultCode === 0 && CallbackMetadata) {
      // Payment successful
      const amount = CallbackMetadata.Item[0].Value;
      const mpesaReceiptNumber = CallbackMetadata.Item[1].Value;
      const transactionDate = CallbackMetadata.Item[3].Value;
      const phoneNumber = CallbackMetadata.Item[4].Value;

      // Update purchase status
      purchase.status = 'paid';
      purchase.amount = amount;
      purchase.phoneNumber = phoneNumber;
      purchase.mpesaMessage = `Payment confirmed. Receipt: ${mpesaReceiptNumber}, Date: ${transactionDate}`;

      await purchase.save();

      console.log('Purchase completed:', purchase);

      // Send purchase confirmation email with proper null checks
      if (purchase.userId && purchase.paidCourse && 
          purchase.userId.email && purchase.userId.name &&
          purchase.paidCourse.title && purchase.paidCourse.instructor) {
        try {
          await sendPurchaseConfirmationEmail(
            purchase.userId.email,
            purchase.userId.name,
            purchase.paidCourse.title,
            purchase.paidCourse.instructor,
            'Lifetime Access',
            'All Levels',
            `Thank you for purchasing ${purchase.paidCourse.title}! Your payment of KES ${amount} has been confirmed.`,
            `${process.env.CLIENT_URL || 'http://localhost:5173'}/my-courses`
          );
          console.log('Purchase confirmation email sent successfully');
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
        }
      } else {
        console.warn('Cannot send email: Missing required user or course data', {
          hasUserId: !!purchase.userId,
          hasPaidCourse: !!purchase.paidCourse,
          userEmail: purchase.userId?.email,
          userName: purchase.userId?.name,
          courseTitle: purchase.paidCourse?.title,
          courseInstructor: purchase.paidCourse?.instructor
        });
      }
    } else {
      // Payment failed
      purchase.mpesaMessage = `Payment failed: ${ResultDesc}`;
      await purchase.save();
      console.log('Payment failed for purchase:', purchase._id, 'Reason:', ResultDesc);
    }

    res.json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('Error processing callback:', error);
    res.status(500).json({ message: 'Server error processing callback' });
  }
});

// Get latest purchase for form population
router.get('/latest-purchase', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const latestPurchase = await Paid.findOne({ userId })
      .populate('paidCourse', 'title')
      .sort({ createdAt: -1 });
    res.json(latestPurchase);
  } catch (error) {
    console.error('Error fetching latest purchase:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;