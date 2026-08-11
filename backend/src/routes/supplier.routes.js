import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import ROLES from "../constants/roles.js";
import { createSupplierValidator, updateSupplierValidator, updateSupplierStatusValidators } from "../validators/supplier.validator.js";
import { addSupplier, getSupplier, getSuppliers, updateSupplier, updateSupplierStatus } from "../controllers/supplier.controller.js";

const router = Router()

router.post(
    "/",
    authenticate,
    authorizeRole(ROLES.ADMIN),
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
    getSupplier,
)

router.patch(
    "/:id",
    authenticate,
    authorizeRole(ROLES.ADMIN),
    updateSupplierValidator,
    validateRequest,
    updateSupplier
)

router.patch(
    "/:id/status",
    authenticate,
    authorizeRole(ROLES.ADMIN),
    updateSupplierStatusValidators,
    validateRequest,
    updateSupplierStatus
)

export default router