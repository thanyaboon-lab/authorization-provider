import { Model } from 'mongoose';
import { UserDocument } from './user.schema';

export class UserRepository {
  constructor(protected db: Model<UserDocument>) {}

  async getAll() {
    return this.db.find({}, {username: 1, email: 1, phone: 1, createdAt: 1}).lean()
  }
}
