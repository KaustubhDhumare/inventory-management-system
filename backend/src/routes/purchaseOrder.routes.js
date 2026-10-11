import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizePermission from "../middleware/permission.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import { cancelPurchaseOrder, createPurchaseOrder, getPurchaseOrder, getPurchseOrders, updatePurchseOrder } from "../controllers/purchaseOrder.controller.js";
import { cancelPurchaseOrderValidator, createPurchaseOrderValidators, updatePurchaseOrderValidators } from "../validators/purchseOrder.validators.js";
import mongoIdParamValidator from "../validators/mongoIdParam.validator.js";

const router = Router()

router.post(
    "/",
    authenticate,
    authorizePermission(PERMISSIONS.PURCHASE_ORDERS_MANAGE),
    createPurchaseOrderValidators,
    validateRequest,
    createPurchaseOrder
);

router.get(
    "/",
    authenticate,
    authorizePermission(PERMISSIONS.PURCHASE_ORDERS_MANAGE),
    getPurchseOrders,
);

router.get(
    "/:id",
    authenticate,
    authorizePermission(PERMISSIONS.PURCHASE_ORDERS_MANAGE),
    mongoIdParamValidator("id", "purchaseOrder id"),
    getPurchaseOrder,
);

router.patch(
    "/:id",
    authenticate,
    authorizePermission(PERMISSIONS.PURCHASE_ORDERS_MANAGE),
    mongoIdParamValidator("id", "purchaseOrder id"), 
    updatePurchaseOrderValidators,
    validateRequest,
    updatePurchseOrder
)

router.patch(
    "/:id/status",
    authenticate,
    authorizePermission(PERMISSIONS.PURCHASE_ORDERS_MANAGE),
    mongoIdParamValidator("id", "purchaseOrder id"),
    cancelPurchaseOrderValidator,
    validateRequest,
    cancelPurchaseOrder
)


export default router
