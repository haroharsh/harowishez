import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserWish extends Document {
  name: string;
  relation?: string;
  birthdayDate: string;
  hash: string;
  wishes: string[];
  quotes: string[];
  pictures: string[];
  customMessage?: string;
  songUrl?: string;
  themeColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserWishSchema: Schema<IUserWish> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    relation: {
      type: String,
      default: '',
      trim: true,
    },
    birthdayDate: {
      type: String,
      required: [true, 'Birthday date is required'],
    },
    hash: {
      type: String,
      required: [true, 'Unique hash route is required'],
      unique: true,
      index: true,
      trim: true,
    },
    wishes: {
      type: [String],
      default: [],
    },
    quotes: {
      type: [String],
      default: [],
    },
    pictures: {
      type: [String],
      default: [],
    },
    customMessage: {
      type: String,
      default: '',
    },
    songUrl: {
      type: String,
      default: '',
    },
    themeColor: {
      type: String,
      default: '#ff5734',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model if already compiled in Next.js hot reload
const UserWish: Model<IUserWish> =
  mongoose.models.UserWish || mongoose.model<IUserWish>('UserWish', UserWishSchema);

export default UserWish;
