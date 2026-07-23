import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"


const registerUser = async (userData)=>{

    const {
        name, 
        email,
        password,
        role
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
        role,
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

export {
    registerUser,
};