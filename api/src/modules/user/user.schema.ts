import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  id: string;
  username: string;
  password: string;
  email: string;
  phone: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  id: { type: String, auto: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;
