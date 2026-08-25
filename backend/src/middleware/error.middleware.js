import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, resp, next) => {
  let error = err;

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((fieldError) => ({
      field: fieldError.path,
      message: fieldError.message,
      value: fieldError.value,
    }));
    error = new ApiError(400, "Validation failed", errors);
  }

  // Invalid MongoDB ObjectId
  else if (err instanceof mongoose.Error.CastError) {
    error = new ApiError(400, `Invalid ${err.path || "resources"} id`);
  }

  // MongoDB duplicate key error
  else if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValues || {})[0];

    error = new ApiError(
      409,
      field ? `${field} already exists` : "Duplicate resources",
    );
  }
  // Unknown error
  else if (!(err instanceof ApiError)) {
    error = new ApiError(500, "Internal server error");
  }

  const response = {
    success: false,
    message: error.message,
  };

  if (error.error !== undefined) {
    response.error = error.error;
  }

  // only expose stack during development
  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }
  
  return resp.status(error.statusCode).json(response);
};

export default errorHandler;
