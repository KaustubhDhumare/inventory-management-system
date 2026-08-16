import PurchaseOrder from "../models/purchaseOrder.model.js";
import Product from "../models/product.model.js";
import Supplier from "../models/supplier.model.js";
import ApiError from "../utils/ApiError.js";
import validateObjectId from "../utils/validateObjectId.js";
import generatePoNumber from "../utils/generatePoNumber.js";
import buildRoleFilter from "../utils/buildRoleFilter.js";
import PURCHASE_ORDER_STATUS from "../constants/purchaseOrderStatus.js";

const createPurchaseOrder = async (purchaseOrderData, orderBy) => {
  const { supplier, orderedItems, expectedDeliveryDate, notes } =
    purchaseOrderData;

  validateObjectId(supplier, "supplier id");
  const supplierDoc = await Supplier.findOne({
    _id: supplier,
    isActive: true,
  });

  if (!supplierDoc) {
    throw new ApiError(404, "Supplier not found");
  }

  const productIds = orderedItems.map((items) => items.product);

  const uniqueProductIds = new Set(productIds);

  if (uniqueProductIds.size !== productIds.length) {
    throw new ApiError(
      400,
      "A product cannot be added more that once to the same purchase order",
    );
  }

  for (const productId of productIds) {
    validateObjectId(productId, "product id");
  }

  const products = await Product.find({
    _id: { $in: productIds },
    isActive: true,
  });

  if (products.length !== productIds.length) {
    throw new ApiError(
      404,
      "One or more products were not found or are inactive",
    );
  }

  let totalAmount = 0;

  const items = orderedItems.map((item) => {
    const itemTotal = item.orderedQuantity * item.unitCost;

    totalAmount += itemTotal;

    return {
      product: item.product,
      orderedQuantity: item.orderedQuantity,
      receivedQuantity: 0,
      unitCost: item.unitCost,
    };
  });

  const poNumber = await generatePoNumber();

  const purchaseOrder = await PurchaseOrder.create({
    poNumber,
    supplier,
    orderBy,
    orderedItems: items,
    totalAmount,
    expectedDeliveryDate,
    notes,
  });

  return purchaseOrder;
};

const getAllPurchaseOrders = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const filter = {};

  if (search.trim()) {
    filter.poNumber = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  const totalDocument = await PurchaseOrder.countDocuments(filter);

  const purchaseOrder = await PurchaseOrder.find(filter)
    .populate("supplier", "companyName contactPerson")
    .populate("orderBy", "name email role")
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limitNumber);

  return {
    purchaseOrder,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalDocument,
      totalPages: Math.ceil(totalDocument / limitNumber),
    },
  };
};

const getPurchseOrdersById = async (purchaseOrderId) => {
  validateObjectId(purchaseOrderId, "purchase order id");

  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId)
    .populate("supplier", "companyName contactPerson email phoneNo")
    .populate("orderBy", "name email role")
    .populate("orderedItems.product", "name sku price unit");

  if (!purchaseOrder) {
    throw new ApiError(404, "Purchase order not found");
  }

  return purchaseOrder;
};

const updatePurchseOrder = async (purchaseOrderId, updateData) => {
  validateObjectId(purchaseOrderId, "purchase order id");

  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);

  if (!purchaseOrder) {
    throw new ApiError(404, "Purchase order not found");
  }

  if (purchaseOrder.status !== PURCHASE_ORDER_STATUS.PENDING) {
    throw new ApiError(400, "Only pending purchase orders can be updated");
  }

  const { supplier, orderedItems, expectedDeliveryDate, notes } = updateData;

  const allowUpdates = {};

  // Supplier
  if (supplier !== undefined) {
    const normalizedSupplier = supplier.trim().toLowerCase();

    const supplierDoc = await Supplier.findOne({
      companyName: normalizedSupplier,
      isActive: true,
    });

    if (!supplierDoc) {
      throw new ApiError(404, "Supplier not found");
    }

    allowUpdates.supplier = supplierDoc._id;
  }

  // Ordered items
  if (orderedItems !== undefined) {
    const productIds = orderedItems.map((item) => item.product);

    productIds.forEach((productId) => {
      validateObjectId(productId, "product id");
    });

    const uniqueProductIds = new Set(productIds.map((id) => id.toString()));

    if (uniqueProductIds.size !== productIds.length) {
      throw new ApiError(
        400,
        "A product cannot appear more that once in a purchase order",
      );
    }

    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    }).select("_id");

    if (products.length !== productIds.length) {
      throw new ApiError(
        404,
        "one or more products were not found or are inactive",
      );
    }

    allowUpdates.orderedItems = orderedItems.map((item) => ({
      product: item.product,
      orderedQuantity: item.orderedQuantity,
      receivedQuantity: 0,
      unitCost: item.unitCost,
    }));

    allowUpdates.totalAmount = orderedItems.reduce(
      (total, item) => total + item.orderedQuantity * item.unitCost,
      0,
    );
  }

  // Expected delivery date
  if (expectedDeliveryDate !== undefined) {
    allowUpdates.expectedDeliveryDate = expectedDeliveryDate;
  }

  // Notes
  if (notes !== undefined) {
    allowUpdates.notes = notes.trim();
  }

  const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
    purchaseOrderId,
    allowUpdates,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedPurchaseOrder;
};

const cancelPurchaseOrder = async (purchaseOrderId) => {
  validateObjectId(purchaseOrderId, "purchase order id");

  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);

  if (!purchaseOrder) {
    throw new ApiError(404, "Purchase order not found");
  }

  if (purchaseOrder.status !== PURCHASE_ORDER_STATUS.PENDING) {
    throw new ApiError(400, "Only pending purchase order can be cancelled");
  }

  const cancelledPurchseOrder = await PurchaseOrder.findByIdAndUpdate(
    purchaseOrderId,
    {
      status: PURCHASE_ORDER_STATUS.CANCELLED,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return cancelledPurchseOrder;
};

export {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchseOrdersById,
  updatePurchseOrder,
  cancelPurchaseOrder,
};
