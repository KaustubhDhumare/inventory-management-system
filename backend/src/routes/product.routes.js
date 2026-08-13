import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import ROLES from "../constants/roles.js";
import { addProduct, getProduct, getProducts, updateProduct, updateProductStatus } from "../controllers/product.controller.js";
import { createProductValidators, updateProductStatusValidators, updateProductValidators } from "../validators/product.validator.js"

const router = Router()

router.post(
    "/",
    authenticate,
    authorizeRole(ROLES.ADMIN),
    createProductValidators,
    validateRequest,
    addProduct
)

router.get(
    "/",
    authenticate,
    getProducts
)

router.get(
    "/:id",
    authenticate,
    getProduct
)

router.patch(
    "/:id",
    authenticate,
    authorizeRole(ROLES.ADMIN),
    updateProductValidators,
    validateRequest,
    updateProduct
)

router.patch(
    "/:id/status",
    authenticate,
    authorizeRole(ROLES.ADMIN),
    updateProductStatusValidators,
    validateRequest,
    updateProductStatus
)



export default router

