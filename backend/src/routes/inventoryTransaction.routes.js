import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import ROLES from "../constants/roles.js";
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
  authorizeRole(ROLES.ADMIN),
  receivePurchseOrderValidators,
  validateRequest,
  receivePurchaseOrderItems,
);

router.get(
  "/",
  authenticate,
  authorizeRole(ROLES.ADMIN),
  getInventoryTransactionValidators,
  validateRequest,
  getInventoryTransactions,
);

router.post(
  "/adjust",
  authenticate,
  authorizeRole(ROLES.ADMIN),
  adjustStockValidators,
  validateRequest,
  adjustStock,
);

router.post(
  "/damage",
  authenticate,
  authorizeRole(ROLES.ADMIN),
  damageStockValidators,
  validateRequest,
  damageStock,
);

router.post(
  "/return",
  authenticate,
  authorizeRole(ROLES.ADMIN),
  returnStockValidators,
  validateRequest,
  returnStock,
);

router.post(
  "/sale",
  authenticate,
  authorizeRole(ROLES.ADMIN),
  sellStockValidators,
  validateRequest,
  sellStock,
);




export default router;
