import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import ROLES from "../constants/roles.js";
import { createPurchaseOrder, getPurchseOrders } from "../controllers/purchaseOrder.controller.js";
import { createPurchaseOrderValidators } from "../validators/purchseOrder.validators.js";


const router = Router()

router.post(
    "/",
    authenticate,
    authorizeRole(ROLES.ADMIN),
    createPurchaseOrderValidators,
    validateRequest,
    createPurchaseOrder
);

router.get(
    "/",
    authenticate,
    authorizeRole(ROLES.ADMIN),
    getPurchseOrders,
);



export default router