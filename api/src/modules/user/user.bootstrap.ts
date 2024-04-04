import { UserController } from "./user.controller";
import UserModel from "./user.schema";
import { UserRepository } from "./user.repository";

const userRepository = new UserRepository(UserModel)
export const userController = new UserController(userRepository)