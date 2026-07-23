import { registerUser, loginUser } from "../services/auth.service.js";
import { accessTokenCookieOption, refreshTokenCookieOption } from "../utils/cookieOptions.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"


const register = asyncHandler(async (req, resp) =>{
    const {
        createdUser,
        accessToken,
        refreshToken,
    } = await registerUser(req.body);

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



const login = asyncHandler(async (req, resp)=>{
    const {
        user,
        accessToken,
        refreshToken
    } = await loginUser(req.body)
    
    return resp
        .status(200)
        .cookie("accessToken", accessToken, accessTokenCookieOption )    
        .cookie("refreshToken", refreshToken, refreshTokenCookieOption )    
        .json(
            new ApiResponse(
                200,
                {
                    user,
                },
                "User logged in successfully"
            )
        );



})

export {
    register,
    login
}