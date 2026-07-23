import { body } from "express-validator";

const registerValidators = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min:3, max:50 })
        .withMessage("Name must be between 3 to 50 characters"),
    
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide valid email address")
        .normalizeEmail(),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min:8 })
        .withMessage("Password must be atleast 8 characters long")
];

export default registerValidators;