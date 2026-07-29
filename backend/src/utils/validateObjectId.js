import mongoose from "mongoose";
import ApiError from "./ApiError.js";


const validateObjectId = (id, name="ID")=>{
    if (!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(
            400,
            `Invalid ${name}`
        );
    }
};


export default validateObjectId