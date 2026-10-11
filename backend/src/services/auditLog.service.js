import AuditLog from "../models/auditlog.model.js";
import InventoryTransaction from "../models/inventorytransaction.model.js";

export const recordAuditLog = (entry) => AuditLog.create(entry);

export const getAuditTimeline = async (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const offset = (page - 1) * limit;
  const sampleSize = offset + limit;

  const [auditCount, transactionCount, auditLogs, transactions] =
    await Promise.all([
      AuditLog.countDocuments(),
      InventoryTransaction.countDocuments(),
      AuditLog.find()
        .populate("performedBy", "name email role")
        .sort({ createdAt: -1 })
        .limit(sampleSize)
        .lean(),
      InventoryTransaction.find()
        .populate("performedBy", "name email role")
        .populate("product", "name sku")
        .populate("purchaseOrder", "poNumber")
        .sort({ createdAt: -1 })
        .limit(sampleSize)
        .lean(),
    ]);

  const transactionEvents = transactions.map((transaction) => ({
    _id: transaction._id,
    performedBy: transaction.performedBy,
    action: transaction.type,
    collectionName: "InventoryTransaction",
    documentId: transaction._id,
    changes: {
      product: transaction.product?.name || "Unknown product",
      sku: transaction.product?.sku || "",
      purchaseOrder: transaction.purchaseOrder?.poNumber || null,
      quantity: transaction.quantity,
      previousQuantity: transaction.previousQuantity,
      newQuantity: transaction.newQuantity,
    },
    remarks: transaction.remarks,
    createdAt: transaction.createdAt,
  }));

  const timeline = [...auditLogs, ...transactionEvents]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(offset, offset + limit);

  const totalDocuments = auditCount + transactionCount;
  return {
    auditLogs: timeline,
    pagination: {
      page,
      limit,
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
    },
  };
};
