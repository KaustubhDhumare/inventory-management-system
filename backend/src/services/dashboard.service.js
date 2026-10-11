import Product from "../models/product.model.js";
import Supplier from "../models/supplier.model.js";
import Category from "../models/category.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import InventoryTransaction from "../models/inventorytransaction.model.js";
import PURCHASE_ORDER_STATUS from "../constants/purchaseOrderStatus.js";

const getInventoryStatus = async () => {
  const [
    totalProducts,
    activeProducts,
    lowStockProducts,
    outOfStockProducts,
    inventoryValueResult,
  ] = await Promise.all([
    Product.countDocuments(),

    Product.countDocuments({
      isActive: true,
    }),

    Product.countDocuments({
      isActive: true,
      $expr: {
        $and: [
          { $gt: ["$quantity", 0] },
          { $lte: ["$quantity", "$minimumStock"] },
        ],
      },
    }),

    Product.countDocuments({
      isActive: true,
      quantity: 0,
    }),

    Product.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $multiply: ["$quantity", "$price"],
            },
          },
        },
      },
    ]),
  ]);

  return {
    totalProducts,
    activeProducts,
    lowStockProducts,
    outOfStockProducts,
    inventoryValue: inventoryValueResult[0]?.total ?? 0,
  };
};

const getBasicStats = async (includePurchaseOrders) => {
  const [
    totalSuppliers,
    totalCategories,
    pendingPurchaseOrders,
    partiallyReceivedPurchaseOrders,
  ] = await Promise.all([
    Supplier.countDocuments(),

    Category.countDocuments(),

    includePurchaseOrders
      ? PurchaseOrder.countDocuments({
          status: PURCHASE_ORDER_STATUS.PENDING,
        })
      : null,

    includePurchaseOrders
      ? PurchaseOrder.countDocuments({
          status: PURCHASE_ORDER_STATUS.PARTIALLY_RECEIVED,
        })
      : null,
  ]);

  return {
    totalSuppliers,
    totalCategories,
    pendingPurchaseOrders,
    partiallyReceivedPurchaseOrders,
  };
};

const getRecentTransactions = async () => {
  return InventoryTransaction.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("product", "name sku")
    .populate("performedBy", "name email");
};

const getInventoryMovement = async () => {
  const today = new Date();
  const start = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 6),
  );
  const rows = await InventoryTransaction.aggregate([
    { $match: { createdAt: { $gte: start, $lte: today } } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        stockIn: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $in: ["$type", ["PURCHASE", "RETURN"]] },
                  {
                    $and: [
                      { $eq: ["$type", "ADJUSTMENT"] },
                      { $gt: ["$newQuantity", "$previousQuantity"] },
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        stockOut: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $in: ["$type", ["SALE", "DAMAGE"]] },
                  {
                    $and: [
                      { $eq: ["$type", "ADJUSTMENT"] },
                      { $lt: ["$newQuantity", "$previousQuantity"] },
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const byDay = new Map(rows.map((row) => [row._id, row]));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start.getTime() + index * 24 * 60 * 60 * 1000);
    const key = date.toISOString().slice(0, 10);
    const row = byDay.get(key);
    return { date: key, stockIn: row?.stockIn ?? 0, stockOut: row?.stockOut ?? 0 };
  });
};

const getRecentPurchaseOrders = async () => {
  return PurchaseOrder.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("supplier", "companyName contactPerson")
    .populate("orderBy", "name email");
};

const getDashboard = async (role) => {
  const isAdmin = role === "admin";
  const [inventory, basicStats, recentTransactions, inventoryMovement, recentPurchaseOrders] =
    await Promise.all([
      getInventoryStatus(),
      getBasicStats(isAdmin),
      isAdmin ? getRecentTransactions() : [],
      getInventoryMovement(),
      isAdmin ? getRecentPurchaseOrders() : [],
    ]);

  return {
    inventory,
    ...basicStats,
    recentTransactions,
    inventoryMovement,
    recentPurchaseOrders,
  };
};


export {
    getDashboard,
}
