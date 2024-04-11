import { BaseController } from '@authorization-provider/core';
import { Request, Response } from 'express';
import UserModel from '../user/user.schema';
import bcrypt from 'bcrypt';
import { LoginRepository } from './login.repository';

export class LoginController extends BaseController {
  constructor(protected loginRepository: LoginRepository) {
    super();
  }

  // register (req: Request, res: Response) {
  //     req.body
  // }

  async login(req: Request, res: Response) {
    const { redirectUri, username, password } = req.body;
    console.log('🚀 ~ redirectUri:', redirectUri);

    let result = {};
    if (username && password) {
      const user = await this.loginRepository.findByUsername(username);
      console.log('🚀 ~ user:', user)
      const isMatch = user && (await bcrypt.compare(password, user?.password));
      console.log('🚀 ~ isMatch:', isMatch);
      if (isMatch) {
        result = {
          userId: user._id,
          username: user.username,
          email: user.email,
        };
        req.session.user = result;
      }
    }
    return {
      data: result,
    };
  }

  // logout (req: Request, res: Response) {

  // }
}
