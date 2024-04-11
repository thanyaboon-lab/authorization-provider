import express, { Request, Response } from 'express';
import { userRoutes } from './modules/user';
import { authRoute } from './modules/auth';
import { loginRoute } from './modules/login';
import { OpenidConfiguration } from '@authorization-provider/core';

const router = express.Router();

router.use('/login', loginRoute)
router.use('/user', userRoutes)

router.use(OpenidConfiguration)

router.use('/oauth', authRoute)


// router.use('/', (req: Request, res: Response) => {
//   res.json({ message: 'Home' });
// });

export default router