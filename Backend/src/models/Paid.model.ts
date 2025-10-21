import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchased extends Document {
  userId: mongoose.Types.ObjectId;
  paidCourse: mongoose.Types.ObjectId;
  amount: number;
  phoneNumber: string;
  mpesaMessage: string;
  status: 'paid' | 'unpaid';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const purchasedSchema = new Schema<IPurchased>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paidCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  mpesaMessage: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  transactionId: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Paid = mongoose.model<IPurchased>('Purchased', purchasedSchema);

export default Paid;