import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizePermission from "../middleware/permission.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import { addProduct, getProduct, getProducts, updateProduct, updateProductStatus } from "../controllers/product.controller.js";
import { createProductValidators, updateProductStatusValidators, updateProductValidators } from "../validators/product.validator.js"
import mongoIdParamValidator from "../validators/mongoIdParam.validator.js";


const router = Router()

router.post(
    "/",
    authenticate,
    authorizePermission(PERMISSIONS.CATALOG_MANAGE),
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
    mongoIdParamValidator("id", "product id"),
    getProduct
)

router.patch(
    "/:id",
    authenticate,
    authorizePermission(PERMISSIONS.CATALOG_MANAGE),
    mongoIdParamValidator("id", "product id"),
    updateProductValidators,
    validateRequest,
    updateProduct
)

router.patch(
    "/:id/status",
    authenticate,
    authorizePermission(PERMISSIONS.CATALOG_MANAGE),
    mongoIdParamValidator("id", "product id"),
    updateProductStatusValidators,
    validateRequest,
    updateProductStatus
)



export default router

