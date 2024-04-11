import express from "express";
import { openidConfigurationController } from "./openid-configuration.bootstrap";

const router = express.Router()

router.get("/.well-known/openid-configuration/jwks", openidConfigurationController.jwks);
router.get("/.well-known/openid-configuration", openidConfigurationController.get);

export default router