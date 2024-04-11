import { Router } from '@authorization-provider/core';
import { loginController } from './login.bootstrap';

const router = new Router();

router.post('/', loginController.login);

export default router.instance;
