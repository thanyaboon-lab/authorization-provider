import { TypedRoute } from '@authorization-provider/core';
import UserModel from '../user/user.schema';
import { LoginController } from './login.controller';
import { LoginRepository } from './login.repository';

export const route = new TypedRoute()
const loginRepository = new LoginRepository(UserModel);
export const loginController = new LoginController(loginRepository);
