import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { EMPLOYEE_DEFAULT_PERMISSIONS, EMPLOYEE_PERMISSION_GROUPS } from "../constants/permissions.js";
import { getAuditTimeline, recordAuditLog } from "../services/auditLog.service.js";
import { getUsers, updateEmployeePermissions, updateEmployeeStatus } from "../services/user.service.js";

export const getUsersController = asyncHandler(async (req, res) => {
  const users = await getUsers(req.query);
  return res.status(200).json(new ApiResponse(200, { users }, "Users fetched successfully"));
});

export const getEmployeePermissionOptions = asyncHandler(async (req, res) =>
  res.status(200).json(new ApiResponse(200, {
    groups: EMPLOYEE_PERMISSION_GROUPS,
    defaults: EMPLOYEE_DEFAULT_PERMISSIONS,
  }, "Employee permission options fetched successfully")),
);

export const getAuditLogsController = asyncHandler(async (req, res) => {
  const auditLogs = await getAuditTimeline(req.query);
  return res.status(200).json(new ApiResponse(200, { auditLogs }, "Audit timeline fetched successfully"));
});

export const updateEmployeePermissionsController = asyncHandler(async (req, res) => {
  const result = await updateEmployeePermissions(req.params.id, req.body.permissions);
  await recordAuditLog({
    performedBy: req.user._id,
    action: "PERMISSIONS_UPDATED",
    collectionName: "User",
    documentId: result.user._id,
    changes: { before: { permissions: result.before }, after: { permissions: result.after } },
  });
  return res.status(200).json(new ApiResponse(200, { user: result.user }, "Employee permissions updated successfully"));
});

export const updateEmployeeStatusController = asyncHandler(async (req, res) => {
  const result = await updateEmployeeStatus(req.params.id, req.body.isActive);
  await recordAuditLog({
    performedBy: req.user._id,
    action: result.after ? "ACCOUNT_ACTIVATED" : "ACCOUNT_DEACTIVATED",
    collectionName: "User",
    documentId: result.user._id,
    changes: { before: { isActive: result.before }, after: { isActive: result.after } },
  });
  return res.status(200).json(new ApiResponse(200, { user: result.user }, "Employee account status updated successfully"));
});
