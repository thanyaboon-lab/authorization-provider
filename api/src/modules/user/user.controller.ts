import { Request, Response } from 'express';
import { UserRepository } from './user.repository';
import { BaseController } from '@authorization-provider/core';

export class UserController extends BaseController {
  constructor(protected userRepository: UserRepository) {
    super()
  }

  async getAll(req: Request, res: Response) {
    return {
      data: await this.userRepository.getAll(),
    };
  }
}
