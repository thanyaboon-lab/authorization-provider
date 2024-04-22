import { UserRepository } from './user.repository';
import { BaseController } from '@authorization-provider/core';
import { route } from './user.bootstrap';
import { z } from 'zod';

export class UserController extends BaseController {
  constructor(protected userRepository: UserRepository) {
    super();
  }

  getAll = route.get('/').handler(async () => {
    return {
      data: await this.userRepository.getAll(),
    };
  });

  get = route
    .get('/:id')
    .params(z.object({ id: z.string() }))
    .handler(async ({ params }) => {
      return {
        data: await this.userRepository.get(params.id),
      };
    });

  create = route
    .post('/')
    .body(
      z.object({
        username: z.string(),
        password: z.string(),
        email: z.string().email(),
        phone: z.string(),
      })
    )
    .handler(async ({ body }) => {
      return {
        data: await this.userRepository.create(body),
      };
    });
}
