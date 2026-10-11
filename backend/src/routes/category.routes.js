import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizePermission from "../middleware/permission.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
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
  authorizePermission(PERMISSIONS.CATALOG_MANAGE),
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
  authorizePermission(PERMISSIONS.CATALOG_MANAGE),
  mongoIdParamValidator("id", "category id"),
  updateCategoryValidator,
  validateRequest,
  updateCategory,
);

router.patch(
  "/:id/status",
  authenticate,
  authorizePermission(PERMISSIONS.CATALOG_MANAGE),
  mongoIdParamValidator("id", "category id"),
  updateCategoryStatusValidator,
  validateRequest,
  updateCategoryStatus,
);

export default router;
