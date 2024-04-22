import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import bcrypt from 'bcrypt';

export class UserRepository {
  constructor(protected db: Model<UserDocument>) {}

  async getAll() {
    return this.db
      .find({}, { username: 1, email: 1, phone: 1, createdAt: 1 })
      .lean();
  }

  async get(id: string) {
    return this.db.findById(id);
  }

  async create(input: UserDocument) {
    if (input.username && input.password && input.email) {
      const user = {
        ...input,
        password: await bcrypt.hash(input.password, 10)
      }
      return this.db.create(user)
    }
    return undefined;
  }
}
