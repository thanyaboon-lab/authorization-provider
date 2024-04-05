import { authController } from "./auth.bootstrap";
import express from "express";

const router = express.Router();

router.get('/authorize', authController.isAuthenticated ,authController.authorize)
router.post('/token', authController.token)
router.get('/authenticate', authController.authenticate)

export default router