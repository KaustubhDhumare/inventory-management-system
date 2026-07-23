// PKG imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Routers imports
import authRoutes from "./routes/auth.routes.js"

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse cookies
app.use(cookieParser());

// Log HTTP requests
app.use(morgan("dev"));


app.use("/api/v1/auth", authRoutes)

// Test route
app.get("/", (req, res) => {
    res.send("Inventory Management API is running...");
});


export default app