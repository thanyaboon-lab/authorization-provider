import { Model } from 'mongoose';
import { IUser } from './user.model';

export class UserRepository {
  constructor(protected db: Model<IUser>) {}

  async getAll() {
    return this.db.find();
  }
}
