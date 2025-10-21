import express, { Request, Response } from 'express';
import Course from '../models/course.model';
import Pricing from '../models/pricing.model';
import Paid from '../models/Paid.model'; // Import Paid model
import { verifyToken } from '../middleware/verifyToken'; // Import auth middleware
import axios from 'axios';
import moment from 'moment';

const router = express.Router();

// Get courses for frontend
router.get('/courses', async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pricing for frontend
router.get('/pricing', async (req: Request, res: Response) => {
  try {
    const pricing = await Pricing.find();
    res.json(pricing);
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// M-Pesa STK Push
async function getAccessToken(): Promise<string> {
  const consumer_key = process.env.MPESA_CONSUMER_KEY || "";
  const consumer_secret = process.env.MPESA_CONSUMER_SECRET || "";
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const auth =
    "Basic " +
    Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: auth,
      },
    });
    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    throw error;
  }
}

router.post('/stkpush', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    let phoneNumber = req.body.phone;
    const accountNumber = req.body.accountNumber;
    const amount = req.body.amount;

    if (phoneNumber.startsWith("0")) {
      phoneNumber = "254" + phoneNumber.slice(1);
    }

    // For M-Pesa sandbox testing, use a valid test phone number
    phoneNumber = "254757230841";

    // ECHO THE DATA THAT WE RECEIVED FROM THE CLIENT
    console.log("User ID:", userId);
    console.log("Phone Number:", phoneNumber);
    console.log("Account Number:", accountNumber);
    console.log("Amount:", amount);

    // Find a course that matches the pricing plan id (accountNumber is now the plan id)
    const course = await Course.findOne({ id: parseInt(accountNumber) });
    if (!course) {
      return res.status(404).json({
        msg: "Course not found for this pricing plan",
        status: false
      });
    }

    const accessToken = await getAccessToken();
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const auth = "Bearer " + accessToken;

    // Generate current timestamp
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');

    // Generate password: base64 of BusinessShortCode + Passkey + Timestamp
    const passkey = "bfb279f9a9bdbcfe158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const password = Buffer.from("174379" + passkey + timestamp).toString("base64");

    const stkResponse = await axios.post(
      url,
      {
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: "174379",
        PhoneNumber: phoneNumber,
        CallBackURL: process.env.CALLBACK_URL || "https://your-ngrok-url.ngrok-free.app/api/purchase/callback",
        AccountReference: accountNumber,
        TransactionDesc: "Course Enrollment"
      },
      {
        headers: {
          Authorization: auth,
        },
      }
    );

    console.log("STK Push Response:", stkResponse.data);

    // Create purchase record in Paid model
    const purchase = new Paid({
      userId: userId,
      paidCourse: course._id,
      amount: amount,
      phoneNumber: phoneNumber,
      mpesaMessage: `Payment initiated for ${course.title}. STK Push sent.`,
      status: 'unpaid',
      transactionId: stkResponse.data.CheckoutRequestID
    });

    await purchase.save();

    res.status(200).json({
      msg: "Request is successful done ✔✔. Please enter mpesa pin to complete the transaction",
      status: true,
      transactionId: stkResponse.data.CheckoutRequestID,
      purchaseId: purchase._id
    });

  } catch (error) {
    console.log("STK Push Error:", error);
    res.status(500).json({
      msg: "Request failed",
      status: false,
    });
  }
});

export default router;