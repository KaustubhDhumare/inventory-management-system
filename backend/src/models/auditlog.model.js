import mongoose from "mongoose";

const auditLog = new mongoose.Schema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      trim: true,
      enum: ["UPDATE", "DELETE", "CREATE"],
      required: true,
    },
    collectionName: {
      type: String,
      enum: [
        "User",
        "Category",
        "Supplier",
        "Product",
        "PurchaseOrder",
        "InventoryTransaction",
      ],
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    changes: {
        type: mongoose.Schema.Types.Mixed,
        required: true
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
