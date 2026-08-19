import mongoose from "mongoose";
import Product from "../models/product.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import InventoryTransaction from "../models/inventorytransaction.model.js";
import ApiError from "../utils/ApiError.js";
import validateObjectId from "../utils/validateObjectId.js";
import PURCHASE_ORDER_STATUS from "../constants/purchaseOrderStatus.js";
import INVENTORY_TRANSACTION_TYPE from "../constants/inventoryTransactionType.js";
import STOCK_ADJUSTMENT_TYPE from "../constants/stockAdjustmentType.js";

const receivePurchaseOrder = async (
  purchaseOrderId,
  receiveData,
  performedBy,
) => {
  validateObjectId(purchaseOrderId, "purchase order id");
  validateObjectId(performedBy, "performed by user id");

  const { items, remarks } = receiveData;

  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);

  if (!purchaseOrder) {
    throw new ApiError(404, "Purchase order not found");
  }

  if (purchaseOrder.status === PURCHASE_ORDER_STATUS.CANCELLED) {
    throw new ApiError(400, "Cancelled purchase order cannot receive items");
  }

  if (purchaseOrder.status === PURCHASE_ORDER_STATUS.COMPLETED) {
    throw new ApiError(
      400,
      "Completed purchase order cannot receive more items",
    );
  }

  // Prevent duplicate products in the same request
  const productIds = items.map((item) => item.product);

  const uniqueProductIds = new Set(productIds.map((id) => id.toString()));

  if (uniqueProductIds.size !== productIds.length) {
    throw new ApiError(
      400,
      "A product cannot appear more than once in a receiving request",
    );
  }

  // Validate product IDs
  productIds.forEach((productId) => {
    validateObjectId(productId, "product id");
  });

  /*
   * Find the corresponding items inside the PO.
   */
  const purchaseOrderItems = new Map(
    purchaseOrder.orderedItems.map((item) => [item.product.toString(), item]),
  );

  for (const item of items) {
    const purchaseOrderItem = purchaseOrderItems.get(item.product.toString());

    if (!purchaseOrderItem) {
      throw new ApiError(
        400,
        `Product ${item.product} does not belong to this purchase order`,
      );
    }

    const remainingQuantity =
      purchaseOrderItem.orderedQuantity - purchaseOrderItem.receivedQuantity;

    if (item.receivedQuantity > remainingQuantity) {
      throw new ApiError(
        400,
        `Cannot receive ${item.receivedQuantity} units. Only ${remainingQuantity} units remaining for product ${item.product}`,
      );
    }
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const transactions = [];

    for (const item of items) {
      const purchaseOrderItem = purchaseOrderItems.get(item.product.toString());

      /*
       * Get product inside transaction.
       */
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new ApiError(404, `Product ${item.product} not found`);
      }

      const previousQuantity = product.quantity;

      const newQuantity = previousQuantity + item.receivedQuantity;

      /*
       * Update product stock.
       */
      product.quantity = newQuantity;

      await product.save({ session });

      /*
       * Update received quantity on PO item.
       */
      purchaseOrderItem.receivedQuantity += item.receivedQuantity;

      /*
       * Create inventory transaction.
       */
      transactions.push({
        product: product._id,
        purchaseOrder: purchaseOrder._id,
        performedBy,
        type: INVENTORY_TRANSACTION_TYPE.PURCHASE,
        quantity: item.receivedQuantity,
        previousQuantity,
        newQuantity,
        remarks,
      });
    }

    /*
     * Determine PO status.
     */
    const allItemsReceived = purchaseOrder.orderedItems.every(
      (item) => item.receivedQuantity === item.orderedQuantity,
    );

    const anyItemReceived = purchaseOrder.orderedItems.some(
      (item) => item.receivedQuantity > 0,
    );

    if (allItemsReceived) {
      purchaseOrder.status = PURCHASE_ORDER_STATUS.COMPLETED;
    } else if (anyItemReceived) {
      purchaseOrder.status = PURCHASE_ORDER_STATUS.PARTIALLY_RECEIVED;
    }

    await purchaseOrder.save({ session });

    /*
     * Save all inventory transactions.
     */
    await InventoryTransaction.insertMany(transactions, { session });

    await session.commitTransaction();

    return purchaseOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getAllInventoryTransactions = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    product,
    purchaseOrder,
    type,
    sortOrder = "desc",
  } = queryParams;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const filter = {};

  if (product !== undefined) {
    validateObjectId(product, "product id");
    filter.product = product;
  }

  if (purchaseOrder !== undefined) {
    validateObjectId(purchaseOrder, "purchase order id");
    filter.purchaseOrder = purchaseOrder;
  }

  if (type !== undefined) {
    filter.type = type;
  }

  const totalDocument = await InventoryTransaction.countDocuments(filter);

  const transactions = await InventoryTransaction.find(filter)
    .populate("product", "name sku unit")
    .populate("purchaseOrder", "poNumber supplier")
    .populate("performedBy", "name email role")
    .sort({ createdAt: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean();

  return {
    transactions,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalDocument,
      totalPages: Math.ceil(totalDocument / limitNumber),
    },
  };
};

const adjustInventoryStock = async (productId, adjustmentData, performedBy) => {
  validateObjectId(productId, "product id");
  validateObjectId(performedBy, "performed ny user id");

  const { quantity, adjustmentType, remarks } = adjustmentData;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    }).session(session);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const previousQuantity = product.quantity;

    let newQuantity;

    if (adjustmentType === STOCK_ADJUSTMENT_TYPE.INCREASE) {
      newQuantity = previousQuantity + quantity;
    } else if (adjustmentType === STOCK_ADJUSTMENT_TYPE.DECREASE) {
      if (quantity > previousQuantity) {
        throw new ApiError(
          400,
          `Cannot decrease stock by ${quantity}. only ${previousQuantity} units available`,
        );
      }
      newQuantity = previousQuantity - quantity;
    } else {
      throw new ApiError(400, "Invalid adjustment type");
    }

    product.quantity = newQuantity;

    await product.save({ session });

    const transaction = await InventoryTransaction.create([
      {
        product: product._id,
        performedBy,
        type: INVENTORY_TRANSACTION_TYPE.ADJUSTMENT,
        quantity,
        previousQuantity,
        newQuantity,
        remarks,
      },
    ]);

    await session.commitTransaction();

    return {
      product,
      transaction: transaction[0],
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const damageInventoryStock = async (productId, damageData, performedBy) => {
  validateObjectId(productId, "product id");
  validateObjectId(performedBy, "performed by user id");

  const {quantity, remarks} = damageData;

  const session = await mongoose.startSession();

  try{
    session.startTransaction();

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if(!product){
      throw new ApiError(404, "Product id not found");
    }

    const previousQuantity = product.quantity;

    if(quantity > previousQuantity){
      throw new ApiError(
        400,
        `Cannot damage ${quantity} units, only ${previousQuantity} units available`
      );
    }

    const newQuantity = previousQuantity - quantity;

    product.quantity = newQuantity;

    await product.save({session});

    const transaction = await InventoryTransaction.create([
      {
        product: product._id,
        performedBy,
        type: INVENTORY_TRANSACTION_TYPE.DAMAGE,
        quantity,
        previousQuantity,
        newQuantity,
        remarks,
      },
    ],
  );

  await session.commitTransaction();

  return{
    product,
    transaction: transaction[0],
  };
  
  } catch (error){
    await session.abortTransaction();
    throw error;
  } finally{
    await session.endSession();
  }
};

export {
  receivePurchaseOrder,
  getAllInventoryTransactions,
  adjustInventoryStock,
  damageInventoryStock,
};
