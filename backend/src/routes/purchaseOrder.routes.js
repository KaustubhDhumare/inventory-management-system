import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import ROLES from "../constants/roles.js";
import { cancelPurchaseOrder, createPurchaseOrder, getPurchaseOrder, getPurchseOrders, updatePurchseOrder } from "../controllers/purchaseOrder.controller.js";
import { cancelPurchaseOrderValidator, createPurchaseOrderValidators, updatePurchaseOrderValidators } from "../validators/purchseOrder.validators.js";


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

router.get(
    "/:id",
    authenticate,
    authorizeRole(ROLES.ADMIN),
    getPurchaseOrder,
);

router.patch(
    "/:id",
    authenticate,
    authorizeRole(ROLES.ADMIN),
    updatePurchaseOrderValidators,
    validateRequest,
    updatePurchseOrder
)

router.patch(
    "/:id/status",
    authenticate,
    authorizeRole(ROLES.ADMIN),
    cancelPurchaseOrderValidator,
    validateRequest,
    cancelPurchaseOrder
)


export default router