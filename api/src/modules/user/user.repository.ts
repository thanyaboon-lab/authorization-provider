import { Model } from 'mongoose';
import { IUser } from './user.schema';

export class UserRepository {
  constructor(protected db: Model<IUser>) {}

  async getAll() {
    return this.db.find();
  }
}
