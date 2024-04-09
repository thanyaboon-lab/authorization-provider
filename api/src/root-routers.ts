import express, { Request, Response } from 'express';
import { userRoutes } from './modules/user';
import { authRoute } from './modules/auth';

const router = express.Router();

router.use('/user', userRoutes)
router.use('/oauth', authRoute)

// router.use('/', (req: Request, res: Response) => {
//   res.json({ message: 'Home' });
// });

export default router