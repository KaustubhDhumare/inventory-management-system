import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import {
  registerValidators,
  loginValidator,
} from "../validators/auth.validator.js";
import validateRequest from "../middleware/validate.middleware.js";
import authenticate from "../middleware/auth.middleware.js";
import authRateLimiter from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  registerValidators,
  validateRequest,
  register,
);

router.post("/login", authRateLimiter, loginValidator, validateRequest, login);

router.post("/refresh-token", refreshAccessToken);

router.post("/logout", authenticate, logout);

export default router;
