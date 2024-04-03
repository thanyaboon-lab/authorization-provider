import express, { Request, Response } from 'express';

const router = express.Router();

router.use('/', (req: Request, res: Response) => {
  res.json({ message: 'Home' });
});

export default router