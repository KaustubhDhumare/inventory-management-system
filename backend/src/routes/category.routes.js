import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import ROLES from "../constants/roles.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
  updateCategoryStatusValidator,
} from "../validators/category.validator.js";
import {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  updateCategoryStatus,
} from "../controllers/category.controller.js";
import mongoIdParamValidator from "../validators/mongoIdParam.validator.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRole(ROLES.ADMIN),
  createCategoryValidator,
  validateRequest,
  addCategory,
);

router.get("/", authenticate, getCategories);

router.get(
  "/:id",
  authenticate,
  mongoIdParamValidator("id", "category id"),
  getCategory,
);

router.patch(
  "/:id",
  authenticate,
  authorizeRole(ROLES.ADMIN),
  mongoIdParamValidator("id", "category id"),
  updateCategoryValidator,
  validateRequest,
  updateCategory,
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRole(ROLES.ADMIN),
  mongoIdParamValidator("id", "category id"),
  updateCategoryStatusValidator,
  validateRequest,
  updateCategoryStatus,
);

export default router;
