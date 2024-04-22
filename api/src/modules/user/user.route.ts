import { Router } from '@authorization-provider/core';
import { userController } from './user.bootstrap';

export default new Router().registerClassRoutes(userController).instance