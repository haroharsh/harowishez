import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminUser extends Document {
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema: Schema<IAdminUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
  },
  {
    timestamps: true,
  }
);

const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser;
