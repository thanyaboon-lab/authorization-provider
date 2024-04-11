import UserModel from '../user/user.schema';
import { LoginController } from './login.controller';
import { LoginRepository } from './login.repository';

const loginRepository = new LoginRepository(UserModel);
export const loginController = new LoginController(loginRepository);
