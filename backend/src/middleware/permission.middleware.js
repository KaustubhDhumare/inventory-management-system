import ApiError from "../utils/ApiError.js";
import ROLES from "../constants/roles.js";
import { EMPLOYEE_DEFAULT_PERMISSIONS } from "../constants/permissions.js";

const authorizePermission = (permission) => (req, resp, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }

  if (req.user.role === ROLES.ADMIN) return next();
  if (req.user.role !== ROLES.EMPLOYEE) {
    throw new ApiError(403, "Your account role cannot perform this action");
  }

  const permissions = req.user.permissions ?? EMPLOYEE_DEFAULT_PERMISSIONS;
  if (!permissions.includes(permission)) {
    throw new ApiError(403, "You do not have this permission");
  }

  return next();
};

export default authorizePermission;
