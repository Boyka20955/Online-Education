import mongoose, { Document, Schema } from 'mongoose';

export interface IPricing extends Document {
  id: number;
  name: string;
  price: number;
  period?: string;
  description: string;
  features: string[];
  popular: boolean;
  buttonText: string;
  createdAt: Date;
  updatedAt: Date;
}

const pricingSchema = new Schema<IPricing>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  period: { type: String },
  description: { type: String, required: true },
  features: [{ type: String, required: true }],
  popular: { type: Boolean, default: false },
  buttonText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPricing>('Pricing', pricingSchema);
