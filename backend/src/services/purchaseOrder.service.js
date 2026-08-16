import PurchaseOrder from "../models/purchaseOrder.model.js";
import Product from "../models/product.model.js";
import Supplier from "../models/supplier.model.js";
import ApiError from "../utils/ApiError.js";
import validateObjectId from "../utils/validateObjectId.js";
import generatePoNumber from "../utils/generatePoNumber.js";
import buildRoleFilter from "../utils/buildRoleFilter.js";

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

  const filter = {}

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


    return{
        purchaseOrder,
        pagination: {
            page: pageNumber,
            limit: limitNumber,
            totalDocument,
            totalPages: Math.ceil(totalDocument / limitNumber),
        },
    };
};

export { createPurchaseOrder, getAllPurchaseOrders };
