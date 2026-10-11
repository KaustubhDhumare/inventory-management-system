import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizePermission from "../middleware/permission.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import { createSupplierValidator, updateSupplierValidator, updateSupplierStatusValidators } from "../validators/supplier.validator.js";
import { addSupplier, getSupplier, getSuppliers, updateSupplier, updateSupplierStatus } from "../controllers/supplier.controller.js";
import mongoIdParamValidator from "../validators/mongoIdParam.validator.js";


const router = Router()

router.post(
    "/",
    authenticate,
    authorizePermission(PERMISSIONS.CATALOG_MANAGE),
    createSupplierValidator,
    validateRequest,
    addSupplier
)

router.get(
    "/",
    authenticate,
    getSuppliers
)

router.get(
    "/:id",
    authenticate,
    mongoIdParamValidator("id", "supplier id"),
    getSupplier,
)

router.patch(
    "/:id",
    authenticate,
    authorizePermission(PERMISSIONS.CATALOG_MANAGE),
    mongoIdParamValidator("id", "supplier id"),
    updateSupplierValidator,
    validateRequest,
    updateSupplier
)

router.patch(
    "/:id/status",
    authenticate,
    authorizePermission(PERMISSIONS.CATALOG_MANAGE),
    mongoIdParamValidator("id", "supplier id"),
    updateSupplierStatusValidators,
    validateRequest,
    updateSupplierStatus
)

export default router
