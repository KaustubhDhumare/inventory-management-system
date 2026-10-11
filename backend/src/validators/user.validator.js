import { body } from "express-validator";
import { ASSIGNABLE_EMPLOYEE_PERMISSIONS } from "../constants/permissions.js";

export const updatePermissionsValidator = [
  body("permissions")
    .isArray()
    .withMessage("Permissions must be an array"),
  body("permissions.*")
    .isIn(ASSIGNABLE_EMPLOYEE_PERMISSIONS)
    .withMessage("Unknown employee permission"),
];

export const updateUserStatusValidator = [
  body("isActive")
    .exists()
    .withMessage("Account status is required")
    .isBoolean()
    .withMessage("Account status must be true or false")
    .custom((value) => {
      if (typeof value !== "boolean") {
        throw new Error("Account status must be a boolean");
      }
      return true;
    }),
];
