import ApiError from "../utils/ApiError.js";

const authorizeRole = (...allowedRole)=>{
    return(req, resp, next)=>{
        if(!req.user){
            throw new ApiError(401, "Unauthorized request");
        }

        if(!allowedRole.includes(req.user.role)){
            throw new ApiError(403, "You are not allowed to perform this action");
        }

        next()

    };
};

export default authorizeRole