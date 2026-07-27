import { registerUser, loginUser, logoutUser, refreshAccessToken as refreshAccessTokenService } from "../services/auth.service.js";
import { accessTokenCookieOption, cookieOptions, refreshTokenCookieOption } from "../utils/cookieOptions.js"
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



});


const logout = asyncHandler(async (req, resp)=>{
    await logoutUser(req.user._id);

    return resp
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, null, "User logged out successfully"))
});


const refreshAccessToken = asyncHandler (async (req, resp)=>{
    const incomingRefreshToken = req.cookies?.refreshToken;

    const {
        accessToken,
        user
    } = await refreshAccessTokenService(incomingRefreshToken);

    return resp
        .status(200)
        .cookie("accessToken", accessToken, accessTokenCookieOption)
        .json(
            new ApiResponse(
                200,
                {user},
                "Access token refreshed successfully"
            )
        );
})




export {
    register,
    login,
    logout,
    refreshAccessToken
}