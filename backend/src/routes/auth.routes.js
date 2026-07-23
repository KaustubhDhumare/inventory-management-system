import { Router } from "express"
import { register } from "../controllers/auth.controller.js"
import registerValidators from "../validators/auth.validator.js"
import validateRequest from "../middleware/validate.middleware.js"


const router = Router()

router.post(
    "/register",
    registerValidators,
    validateRequest,
    register
)


export default router;