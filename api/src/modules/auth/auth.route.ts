import { Router } from "@authorization-provider/core";
import { authController } from "./auth.bootstrap";

const router = new Router();

router.get('/authorize', authController.isAuthenticated ,authController.authorize)
router.post('/token', authController.token)
router.get('/authenticate', authController.authenticate)

/** generate Key pair */
router.get('/generateApplicationKey', authController.generateApplicationKey)

export default router.instance