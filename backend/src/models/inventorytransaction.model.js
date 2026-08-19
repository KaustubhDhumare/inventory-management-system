import mongoose from "mongoose";
import INVENTORY_TRANSACTION_TYPE from "../constants/inventoryTransactionType.js";

const inventoryTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    purchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      index: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(INVENTORY_TRANSACTION_TYPE),
      default: INVENTORY_TRANSACTION_TYPE.PURCHASE,
    },
    quantity: {
      type: Number,
      min: [1, "Quantity must be at least 1"],
      required: true,
    },
    previousQuantity: {
      type: Number,
      required: true,
      min: [0, "Previous quantity cannot be negative"],
    },
    newQuantity: {
      type: Number,
      required: true,
      min: [0, "New quantity cannot be negative"],
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, "Remarks cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  },
);

const InventoryTransaction = mongoose.model(
  "InventoryTransaction",
  inventoryTransactionSchema,
);

export default InventoryTransaction;
