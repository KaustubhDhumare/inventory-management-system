import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizePermission from "../middleware/permission.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import {
  receivePurchseOrderValidators,
  getInventoryTransactionValidators,
  adjustStockValidators,
  damageStockValidators,
  returnStockValidators,
  sellStockValidators,
} from "../validators/inventoryTransaction.validators.js";
import {
  receivePurchaseOrderItems,
  getInventoryTransactions,
  adjustStock,
  damageStock,
  returnStock,
  sellStock,
} from "../controllers/inventoryTransaction.controller.js";

const router = Router();

router.post(
  "/purchase-order/:id/receive",
  authenticate,
  authorizePermission(PERMISSIONS.PURCHASE_ORDERS_MANAGE),
  receivePurchseOrderValidators,
  validateRequest,
  receivePurchaseOrderItems,
);

router.get(
  "/",
  authenticate,
  authorizePermission(PERMISSIONS.TRANSACTIONS_READ),
  getInventoryTransactionValidators,
  validateRequest,
  getInventoryTransactions,
);

router.post(
  "/adjust",
  authenticate,
  authorizePermission(PERMISSIONS.INVENTORY_ADJUST),
  adjustStockValidators,
  validateRequest,
  adjustStock,
);

router.post(
  "/damage",
  authenticate,
  authorizePermission(PERMISSIONS.INVENTORY_DAMAGE),
  damageStockValidators,
  validateRequest,
  damageStock,
);

router.post(
  "/return",
  authenticate,
  authorizePermission(PERMISSIONS.INVENTORY_RETURN),
  returnStockValidators,
  validateRequest,
  returnStock,
);

router.post(
  "/sale",
  authenticate,
  authorizePermission(PERMISSIONS.INVENTORY_SALE),
  sellStockValidators,
  validateRequest,
  sellStock,
);




export default router;
