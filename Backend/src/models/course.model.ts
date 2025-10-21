import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  id: number;
  title: string;
  text: string;
  instructor: string;
  img: string;
  imageData?: string; // Base64 encoded image data
  tags?: { tag: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: false // Make optional since we'll use imageData
  },
  imageData: {
    type: String,
    required: false
  },
  tags: [{
    tag: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course;
