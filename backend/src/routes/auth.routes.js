import { Router } from "express"
import { register, login } from "../controllers/auth.controller.js"
import {registerValidators, loginValidator} from "../validators/auth.validator.js"
import validateRequest from "../middleware/validate.middleware.js"


const router = Router()

router.post(
    "/register",
    registerValidators,
    validateRequest,
    register
)

router.post(
    "/login",
    loginValidator,
    validateRequest,
    login
)


export default router;