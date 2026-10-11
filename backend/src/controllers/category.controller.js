import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory as updateCategoryService,
  updateCategoryStatus as categoryStatus,
} from "../services/category.service.js";
import { recordAuditLog } from "../services/auditLog.service.js";

const addCategory = asyncHandler(async (req, resp) => {
  const category = await createCategory(req.body, req.user._id);
  await recordAuditLog({ performedBy: req.user._id, action: "CREATE", collectionName: "Category", documentId: category._id, changes: { after: req.body } });

  return resp
    .status(201)
    .json(new ApiResponse(201, { category }, "Category created successfully"));
});

const getCategories = asyncHandler(async (req, resp) => {
  const categories = await getAllCategory(req.query, req.user.role);

  return resp
    .status(200)
    .json(
      new ApiResponse(200, { categories }, "Categories fetched successfully"),
    );
});

const getCategory = asyncHandler(async (req, resp) => {
  const category = await getCategoryById(req.params.id);

  return resp
    .status(200)
    .json(new ApiResponse(200, { category }, "Category fetched successfully"));
});

const updateCategory = asyncHandler(async (req, resp) => {
  const updatedCategory = await updateCategoryService(req.params.id, req.body);
  await recordAuditLog({ performedBy: req.user._id, action: "UPDATE", collectionName: "Category", documentId: updatedCategory._id, changes: { submitted: req.body } });

  return resp
    .status(200)
    .json(
      new ApiResponse(200, {category: updatedCategory}, "Category updated successfully"),
    );
});

const updateCategoryStatus = asyncHandler(async (req, resp) => {
  const updatedCategory = await categoryStatus(req.params.id, req.body.isActive);
  await recordAuditLog({ performedBy: req.user._id, action: "STATUS_CHANGED", collectionName: "Category", documentId: updatedCategory._id, changes: { isActive: updatedCategory.isActive } });

  return resp
    .status(200)
    .json(
      new ApiResponse(200, {category: updatedCategory}, "Category updated successfully"),
    );
});

export { addCategory, getCategories, getCategory, updateCategory, updateCategoryStatus };
