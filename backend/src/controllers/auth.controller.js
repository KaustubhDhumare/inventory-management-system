import { registerUser, loginUser, changeUserPassword, logoutUser, refreshAccessToken as refreshAccessTokenService } from "../services/auth.service.js";
import { accessTokenCookieOption, cookieOptions, refreshTokenCookieOption } from "../utils/cookieOptions.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import { recordAuditLog } from "../services/auditLog.service.js";


const register = asyncHandler(async (req, resp) =>{
    const {
        createdUser,
        accessToken,
        refreshToken,
    } = await registerUser(req.body);

    await recordAuditLog({
        performedBy: createdUser._id,
        action: "ACCOUNT_REGISTERED",
        collectionName: "User",
        documentId: createdUser._id,
        changes: { role: createdUser.role, isActive: createdUser.isActive },
    });

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

    await recordAuditLog({
        performedBy: user._id,
        action: "LOGIN",
        collectionName: "User",
        documentId: user._id,
        changes: { event: "authenticated" },
    });
    
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

    await recordAuditLog({
        performedBy: req.user._id,
        action: "LOGOUT",
        collectionName: "User",
        documentId: req.user._id,
        changes: { event: "signed out" },
    });

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

const changePassword = asyncHandler(async (req, resp) => {
    const { user, accessToken, refreshToken } = await changeUserPassword(
        req.user._id,
        req.body.currentPassword,
        req.body.newPassword,
    );

    await recordAuditLog({
        performedBy: user._id,
        action: "PASSWORD_CHANGED",
        collectionName: "User",
        documentId: user._id,
        changes: { event: "password changed by account owner" },
    });

    return resp
        .status(200)
        .cookie("accessToken", accessToken, accessTokenCookieOption)
        .cookie("refreshToken", refreshToken, refreshTokenCookieOption)
        .json(new ApiResponse(200, { user }, "Password changed successfully"));
});




export {
    register,
    login,
    logout,
    refreshAccessToken,
    changePassword,
}
