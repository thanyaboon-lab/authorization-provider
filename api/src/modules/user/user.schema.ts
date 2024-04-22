import mongoose, { Schema } from 'mongoose';

export interface UserDocument {
  username: string;
  password: string;
  email: string;
  phone: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;
