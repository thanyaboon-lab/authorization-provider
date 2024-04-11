import { Model } from 'mongoose';
import { UserDocument } from '../user/user.schema';

export class LoginRepository {
  constructor(protected db: Model<UserDocument>) {}

  async findByUsername(username: string) {
    return this.db.findOne({ username });
  }

  async findByEmail(email: string) {
    return this.db.findOne({ email });
  }
}
