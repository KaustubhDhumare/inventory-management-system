import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse cookies
app.use(cookieParser());

// Log HTTP requests
app.use(morgan("dev"));


// Test route
app.get("/", (req, res) => {
    res.send("Inventory Management API is running...");
});


export default app