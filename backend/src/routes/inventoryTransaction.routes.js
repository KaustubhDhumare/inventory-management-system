import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import ROLES from "../constants/roles.js";
import { receivePurchseOrderValidators, getInventoryTransactionValidators } from "../validators/inventoryTransaction.validators.js";
import { receivePurchaseOrderItems, getInventoryTransactions } from "../controllers/inventoryTransaction.controller.js";


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




export default router


