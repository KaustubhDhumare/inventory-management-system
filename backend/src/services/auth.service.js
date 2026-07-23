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

export {
    registerUser,
    loginUser
};