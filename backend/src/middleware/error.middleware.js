const errorHandler = (err, req, resp, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    return resp.status(statusCode).json({
        success: false,
        message,
        error: err.error || [],
        stack: 
            process.env.NODE_ENV === "development"
                ?err.stack
                : undefined,
    });
};


export default errorHandler;