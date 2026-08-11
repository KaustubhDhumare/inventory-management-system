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
import ApiResponse from "../utils/ApiResponse.js";

const router = Router();

router.post("/register", registerValidators, validateRequest, register);
 
router.post("/login", loginValidator, validateRequest, login);

router.post("/refresh-token", refreshAccessToken);

router.post("/logout", authenticate, logout);

export default router;
