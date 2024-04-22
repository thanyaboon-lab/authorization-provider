import { BaseController, ValidationError } from '@authorization-provider/core';
import { Request, Response } from 'express';
import UserModel from '../user/user.schema';
import bcrypt from 'bcrypt';
import { LoginRepository } from './login.repository';
import { route } from './login.bootstrap';
import { z } from 'zod';

export class LoginController extends BaseController {
  constructor(protected loginRepository: LoginRepository) {
    super();
  }

  login = route
    .post('/')
    .body(
      z.object({
        username: z.string(),
        password: z.string(),
        redirectUri: z.string(),
      })
    )
    .handler(async ({ body, req }) => {
      let result = {};
      const { username, password, redirectUri } = body;
      console.log('🚀 ~ redirectUri:', redirectUri);
      if (username && password) {
        const user = await this.loginRepository.findByUsername(username);
        console.log('🚀 ~ user:', user);
        const isMatch =
          user && (await bcrypt.compare(password, user?.password));
        console.log('🚀 ~ isMatch:', isMatch);
        if (isMatch) {
          result = {
            userId: user._id,
            username: user.username,
            email: user.email,
          };
          req.session.user = result;
        } else {
          throw new ValidationError('User Not Found')
        }
      }
      return {
        data: result,
      };
    });
}
