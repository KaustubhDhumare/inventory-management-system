import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  changePassword,
} from "../controllers/auth.controller.js";
import {
  registerValidators,
  loginValidator,
  changePasswordValidator,
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

router.patch(
  "/change-password",
  authenticate,
  authRateLimiter,
  changePasswordValidator,
  validateRequest,
  changePassword,
);

router.post("/logout", authenticate, logout);

export default router;
