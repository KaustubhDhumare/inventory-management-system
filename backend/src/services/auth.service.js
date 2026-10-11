import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";


const registerUser = async (userData)=>{

    const {
        name, 
        email,
        password,
    } = userData

    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new ApiError (
            409,
            "User already exist with this email"
        );
    }

    const user = await User.create({
        name, 
        email,
        password,
        role: "employee",
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({
        validateBeforeSave: false,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(
            500, 
            "Something went wrong while registering the user try again later."
        );
    }

    return{
        createdUser,
        accessToken, 
        refreshToken,
    };

};


const loginUser = async (userData)=>{
    const {
        email,
        password,
    } = userData;

    const user = await User.findOne( {email} ).select('+password') 
    if(!user){
        throw new ApiError(
            401,
            "invalid email or password."
        )
    }

    if(!user.isActive){
        throw new ApiError(
            403,
            "Your account has been deactivated by the admin."
        )
    }


    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new ApiError(
            401,
            "invalid email or password"
        )
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken
    await user.save({
        validateBeforeSave: false,
    })

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");



    return{
        user: loggedInUser,
        accessToken,
        refreshToken,
    }

}

const changeUserPassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select("+password");
    if (!user) throw new ApiError(404, "User not found");
    if (!user.isActive) throw new ApiError(403, "Your account has been deactivated");

    const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordCorrect) {
        throw new ApiError(400, "Current password is incorrect");
    }
    if (currentPassword === newPassword) {
        throw new ApiError(400, "New password must be different from your current password");
    }

    user.password = newPassword;
    user.authVersion = (user.authVersion || 0) + 1;
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    const safeUser = await User.findById(user._id).select("-password -refreshToken");
    return { user: safeUser, accessToken, refreshToken };
};


const logoutUser = async (userId)=>{
    const user  = await User.findById(userId);

    if (!user){
        throw new ApiError (404, "User not found");
    }

    user.refreshToken = null 

    await user.save({
        validateBeforeSave: false,
    });

    return true

};


const refreshAccessToken = async (incomingRefreshToken)=>{
    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh token is missing");
    }

    let decodedToken;
    try{
        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.JWT_REFRESH_SECRET
        );
    } catch(error){
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decodedToken._id);

    if(!user){
        throw new ApiError(401, "Invalid refresh token");
    }

    if(!user.isActive){
        throw new ApiError(403, "Your account has been deactivated");
    }

    if(user.refreshToken !== incomingRefreshToken){
        throw new ApiError(401, "Refresh token is invalid");
    }

    const accessToken = user.generateAccessToken();

    const setUser = await User.findById(user._id).select("-password -refreshToken");

    return{
        accessToken,
        user: setUser
    }

}


export {
    registerUser,
    loginUser,
    changeUserPassword,
    logoutUser,
    refreshAccessToken
};
