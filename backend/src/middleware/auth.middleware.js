import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";


const authenticate = asyncHandler( async (req, resp, next)=>{
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!accessToken){
        throw new ApiError(401, "Access token is missing.");
    }

    let decodedToken;
    try{
        decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET
        );
    } catch(error){
        throw new ApiError(401, "Invalid or expired access token")
    }

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if(!user){
        throw new ApiError(401, "User not found");
    }

    if(!user.isActive){
        throw new ApiError(403, "Your account has been deactivated");
    }

    req.user = user;
    next();

});

export default authenticate;
