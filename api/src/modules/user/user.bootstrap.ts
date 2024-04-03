import { UserController } from "./user.controller";
import UserModel from "./user.model";
import { UserRepository } from "./user.repository";

const userRepository = new UserRepository(UserModel)
export const userController = new UserController(userRepository)