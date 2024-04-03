import { Router } from '@authorization-provider/core';
import { userController } from './user.bootstrap';

const router = new Router();

router.get('/', userController.getAll)

export default router.instance