import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";


const validateRequest = (req, resp, next)=>{
    const error = validationResult(req);
    
    if(!error.isEmpty()){
        throw new ApiError(
            400, 
            "Validation failed",
            error.array()
        );
    }

    next();
};

export default validateRequest; 