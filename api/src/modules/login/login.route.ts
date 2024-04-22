import { Router } from '@authorization-provider/core';
import { loginController } from './login.bootstrap';

export default new Router().registerClassRoutes(loginController).instance;
