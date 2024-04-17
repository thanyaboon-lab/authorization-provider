import { UserController } from "./user.controller";
import UserModel from "./user.schema";
import { UserRepository } from "./user.repository";
import { TypedRoute } from "@authorization-provider/core";

export const route = new TypedRoute()
const userRepository = new UserRepository(UserModel)
export const userController = new UserController(userRepository)