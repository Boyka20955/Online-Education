import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  id: number;
  title: string;
  instructor: string;
  text: string;
  img?: string;
  link?: string;
  userId: mongoose.Types.ObjectId;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseSchema = new Schema<IPurchase>({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Purchase = mongoose.model<IPurchase>('Purchase', purchaseSchema);

export default Purchase;