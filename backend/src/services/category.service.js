import mongoose from "mongoose";
import Category from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";
import validateObjectId from "../utils/validateObjectId.js";

const createCategory = async (categoryData, createdBy) => {
  const { name, description } = categoryData;

  const normalisedName = name.trim().toLowerCase();

  const existingCategory = await Category.findOne({ name: normalisedName });

  if (existingCategory) {
    throw new ApiError(409, "Category already exists");
  }

  const category = await Category.create({
    name: normalisedName,
    description: description?.trim(),
    createdBy,
  });

  return category;
};

const getAllCategory = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "name",
    sortOrder = "asc",
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const filter = {
    isActive: true,
  };

  if (search.trim()) {
    filter.name = {
      $regex: search,
      $option: "i",
    };
  }

  const totalDocumnet = await Category.countDocuments(filter);

  const categories = await Category.find(filter)
    .sort({
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    })
    .skip(skip)
    .limit(limitNumber);

  return {
    categories,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalDocumnet,
      totalPages: Math.ceil(totalDocumnet / limitNumber),
    },
  };
};

const getCategoryById = async (categoryId) => {
  validateObjectId(categoryId, "category id");

  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

const updateCategory = async (categoryId, updateData) => {
  validateObjectId(categoryId, "category id");

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const { name, description } = updateData;

  const allowedUpdates = {};

  if (name !== undefined) {
    const normalisedName = name.trim().toLowerCase();

    if (!normalisedName) {
      throw new ApiError(400, "Category name cannot be empty");
    }

    const existingCategory = await Category.findOne({
      name: normalisedName,
      _id: {
        $ne: categoryId,
      },
    });

    if (existingCategory) {
      throw new ApiError(409, "Category with this name already exists");
    }

    allowedUpdates.name = normalisedName;
  }

  if (description !== undefined) {
    allowedUpdates.description = description.trim();
  }

  const updateCategory = await Category.findByIdAndUpdate(
    categoryId,
    allowedUpdates,
    {
      new: true,
      runValidators: true,
    },
  );

  return updateCategory;
};

const updateCategoryStatus = async (categoryId, isActive) => {
  validateObjectId(categoryId, "category id");

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (category.isActive === isActive) {
    throw new ApiError(
      400,
      `Category is already ${isActive ? "active" : "inactive"}`,
    );
  }

  const updateCategory = await Category.findByIdAndUpdate(
    categoryId,
    { isActive },
    {
      new: true,
      runValidators: true,
    },
  );

  return updateCategory;
};

export {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
};
