// PKG imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Error handler
import errorHandler from "./middleware/error.middleware.js";


// Routers imports
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import supplierRoutes from "./routes/supplier.routes.js"

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse cookies
app.use(cookieParser());

// Log HTTP requests
app.use(morgan("dev"));


// Routes
app.use("/api/v1/auth", authRoutes)

app.use("/api/v1/categories", categoryRoutes)

app.use("/api/v1/suppliers", supplierRoutes)








app.use(errorHandler)
export default app