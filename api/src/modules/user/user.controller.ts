import { Request, Response } from 'express';
import { UserRepository } from './user.repository';
import { BaseController } from '@authorization-provider/core';

export class UserController {
  constructor(protected userRepository: UserRepository) {}

  async getAll(req: Request, res: Response) {
    return {
      data: await this.userRepository.getAll(),
    };
  }
}
