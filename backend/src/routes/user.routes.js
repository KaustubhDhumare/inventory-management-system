import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import ROLES from "../constants/roles.js";
import mongoIdParamValidator from "../validators/mongoIdParam.validator.js";
import { updatePermissionsValidator, updateUserStatusValidator } from "../validators/user.validator.js";
import {
  getAuditLogsController,
  getEmployeePermissionOptions,
  getUsersController,
  updateEmployeePermissionsController,
  updateEmployeeStatusController,
} from "../controllers/user.controller.js";

const router = Router();
router.use(authenticate, authorizeRole(ROLES.ADMIN));

router.get("/permissions", getEmployeePermissionOptions);
router.get("/audit-logs", getAuditLogsController);
router.get("/", getUsersController);
router.patch(
  "/:id/permissions",
  mongoIdParamValidator("id", "user id"),
  updatePermissionsValidator,
  validateRequest,
  updateEmployeePermissionsController,
);
router.patch(
  "/:id/status",
  mongoIdParamValidator("id", "user id"),
  updateUserStatusValidator,
  validateRequest,
  updateEmployeeStatusController,
);

export default router;
