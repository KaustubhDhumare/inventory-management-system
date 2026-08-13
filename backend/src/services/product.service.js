import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Supplier from "../models/supplier.model.js";
import ApiError from "../utils/ApiError.js";
import validateObjectId from "../utils/validateObjectId.js";
import buildRoleFilter from "../utils/buildRoleFilter.js";

const createProduct = async (productData, createdBy) => {
  const { name, sku, description, price, quantity, minimumStock, unit, category, supplier } =
    productData;

  const normalisedSku = sku.trim().toLowerCase();
  const normalisedCategory = category.trim().toLowerCase();
  const normalisedSupplier = supplier.trim().toLowerCase();

  const existingProduct = await Product.findOne({
    sku: normalisedSku,
  });

  if (existingProduct) {
    throw new ApiError(409, "This product SKU already exists");
  }

  const categoryDoc = await Category.findOne({
    name: normalisedCategory,
    isActive: true,
  });

  if (!categoryDoc) {
    throw new ApiError(404, "Category not found");
  }

  const supplierDoc = await Supplier.findOne({
    companyName: normalisedSupplier,
    isActive: true,
  });

  if (!supplierDoc) {
    throw new ApiError(404, "Supplier not found");
  }

  const product = await Product.create({
    name,
    sku: normalisedSku,
    description,
    price,
    quantity,
    minimumStock,
    unit,
    category: categoryDoc._id,
    supplier: supplierDoc._id,
    createdBy,
  });

  return product;
};

const getAllProducts = async (query, role) => {
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

  const filter = buildRoleFilter(role)
  
  if (search.trim()) {
    filter.name = {
      $regex: "search",
      $options: "i",
    };
  }

  const totalDocumnet = await Product.countDocuments(filter);

  const product = await Product.find(filter)
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limitNumber);

  return {
    product,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalDocumnet,
      totalPages: Math.ceil(totalDocumnet / limitNumber),
    },
  };
};

const getProductById = async (productId) => {
  validateObjectId(productId, "product id");
  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

const updateProduct = async (productId, updateData) => {
  validateObjectId(productId, "product id");
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const {
    name,
    sku,
    description,
    price,
    quantity,
    minimumStock,
    unit,
    category,
    supplier,
  } = updateData;

  const allowedUpdates = {};

  if (name !== undefined) {
    const normalisedName = name.trim();

    if (!normalisedName) {
      throw new ApiError(400, "Product name cannot be empty");
    }

    allowedUpdates.name = normalisedName;
  }

  if (sku !== undefined) {
    const normalisedSku = sku.trim().toLowerCase();

    if (!normalisedSku) {
      throw new ApiError(400, "sku cannot be empty");
    }
    const existingProduct = await Product.findOne({
      sku: normalisedSku,
      _id: {
        $ne: productId,
      },
    });

    if (existingProduct) {
      throw new ApiError(409, "Product with this SKU id already exist");
    }
    allowedUpdates.sku = normalisedSku;
  }

  if (description !== undefined) {
    const normalisedDescription = description.trim();

    if (!normalisedDescription) {
      throw new ApiError(400, "Description cannot be empty");
    }

    allowedUpdates.description = normalisedDescription;
  }

  if (price !== undefined) {
    allowedUpdates.price = price;
  }
  if (quantity !== undefined) {
    allowedUpdates.quantity = quantity;
  }
  if (minimumStock !== undefined) {
    allowedUpdates.minimumStock = minimumStock;
  }
  if (unit !== undefined) {
    allowedUpdates.unit = unit;
  }

  if (category !== undefined) {
    const normalisedCategory = category.trim().toLowerCase();

    const categoryDoc = await Category.findOne({
      name: normalisedCategory,
      isActive: true,
    });

    if (!categoryDoc) {
      throw new ApiError(404, "Category not found");
    }
    allowedUpdates.category = categoryDoc._id;
  }

  if (supplier !== undefined) {
    const normalisedSupplier = supplier.trim().toLowerCase();

    const supplierDoc = await Supplier.findOne({
      companyName: normalisedSupplier,
      isActive: true,
    });

    if (!supplierDoc) {
      throw new ApiError(404, "Supplier not found");
    }
    allowedUpdates.supplier = supplierDoc._id;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    allowedUpdates,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedProduct;
};

const updateProductStatus = async (productId, isActive) => {
  validateObjectId(productId, "product id");
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.isActive === isActive) {
    throw new ApiError(
      400,
      `Product is already ${isActive ? "active" : "inactive"}`,
    );
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {isActive},
    {
      new: true,
      runValidators: true,
    },
  );
  return updatedProduct;
};

export { createProduct, getAllProducts, getProductById, updateProduct, updateProductStatus };
