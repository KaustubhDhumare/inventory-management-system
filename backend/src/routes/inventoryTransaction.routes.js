import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import ROLES from "../constants/roles.js";
import { receivePurchseOrderValidators, getInventoryTransactionValidators, adjustStockValidators } from "../validators/inventoryTransaction.validators.js";
import { receivePurchaseOrderItems, getInventoryTransactions, adjustStock } from "../controllers/inventoryTransaction.controller.js";


const router = Router()


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
    adjustStock
)




export default router


