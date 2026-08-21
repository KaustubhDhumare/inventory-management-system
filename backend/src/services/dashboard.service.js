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

const getBasicStats = async () => {
  const [
    totalSuppliers,
    totalCategories,
    pendingPurchaseOrders,
    partiallyReceivedPurchaseOrders,
  ] = await Promise.all([
    Supplier.countDocuments(),

    Category.countDocuments(),

    PurchaseOrder.countDocuments({
      status: PURCHASE_ORDER_STATUS.PENDING,
    }),

    PurchaseOrder.countDocuments({
      status: PURCHASE_ORDER_STATUS.PARTIALLY_RECEIVED,
    }),
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

const getRecentPurchaseOrders = async () => {
  return PurchaseOrder.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("supplier", "companyName contactPerson")
    .populate("orderBy", "name email");
};

const getDashboard = async () => {
  const [inventory, basicStats, recentTransactions, recentPurchaseOrders] =
    await Promise.all([
      getInventoryStatus(),
      getBasicStats(),
      getRecentTransactions(),
      getRecentPurchaseOrders(),
    ]);

  return {
    inventory,
    ...basicStats,
    recentTransactions,
    recentPurchaseOrders,
  };
};


export {
    getDashboard,
}
