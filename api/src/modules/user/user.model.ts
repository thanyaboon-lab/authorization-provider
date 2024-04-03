import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  phone: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;