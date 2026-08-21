import {Router} from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import ROLES from "../constants/roles.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";


const router = Router();

router.get(
    "/",
    authenticate,
    authorizeRole(ROLES.ADMIN, ROLES.EMPLOYEE),
    getDashboardData,
);


export default router

