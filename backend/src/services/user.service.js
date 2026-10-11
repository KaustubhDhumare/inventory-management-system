import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import validateObjectId from "../utils/validateObjectId.js";
import ROLES from "../constants/roles.js";
import { EMPLOYEE_DEFAULT_PERMISSIONS } from "../constants/permissions.js";

const publicUserFields = "name email role permissions isActive createdAt updatedAt";

export const getUsers = async ({ page = 1, limit = 20, search = "" } = {}) => {
  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(100, Math.max(1, Number(limit) || 20));
  const escapedSearch = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const filter = escapedSearch
    ? {
        $or: [
          { name: { $regex: escapedSearch, $options: "i" } },
          { email: { $regex: escapedSearch, $options: "i" } },
        ],
      }
    : {};
  const skip = (pageNumber - 1) * limitNumber;
  const [users, totalDocuments] = await Promise.all([
    User.find(filter)
      .select(publicUserFields)
      .sort({ role: 1, name: 1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    users: users.map((user) => ({
      ...user,
      permissions: user.permissions ?? (user.role === ROLES.EMPLOYEE ? [...EMPLOYEE_DEFAULT_PERMISSIONS] : []),
    })),
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limitNumber),
    },
  };
};

const findEmployee = async (id) => {
  validateObjectId(id, "user id");
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role !== ROLES.EMPLOYEE) {
    throw new ApiError(400, "Only employee accounts can be managed here");
  }
  return user;
};

export const updateEmployeePermissions = async (id, permissions) => {
  const user = await findEmployee(id);
  const before = [...(user.permissions || [])];
  user.permissions = [...new Set(permissions)];
  user.authVersion = (user.authVersion || 0) + 1;
  await user.save();
  return {
    user: await User.findById(user._id).select(publicUserFields).lean(),
    before,
    after: [...user.permissions],
  };
};

export const updateEmployeeStatus = async (id, isActive) => {
  const user = await findEmployee(id);
  const before = user.isActive;
  user.isActive = isActive;
  user.authVersion = (user.authVersion || 0) + 1;
  if (!isActive) user.refreshToken = null;
  await user.save();
  return {
    user: await User.findById(user._id).select(publicUserFields).lean(),
    before,
    after: user.isActive,
  };
};
