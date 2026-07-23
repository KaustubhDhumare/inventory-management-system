import { registerUser } from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"


const register = asyncHandler(async (req, resp) =>{
    const {
        createdUser,
        accessToken,
        refreshToken,
    } = await registerUser(req.body);

    const accessTokenCookieOption = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 , 
    };
    const refreshTokenCookieOption = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000 ,
    };

    return resp
        .status(201)
        .cookie("accessToken", accessToken, accessTokenCookieOption )    
        .cookie("refreshToken", refreshToken, refreshTokenCookieOption )    
        .json(
            new ApiResponse(
                201,
                {
                    user: createdUser,
                },
                "User registered is successfully"
            )
        );
});


export {
    register,
}