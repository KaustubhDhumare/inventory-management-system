import { body } from "express-validator";

const registerValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
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
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long"),
];

const loginValidator = [
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
];

const changePasswordValidator = [
  body("currentPassword")
    .isString()
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isString()
    .isLength({ min: 8, max: 128 })
    .withMessage("New password must be between 8 and 128 characters")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New password must be different from your current password");
      }
      return true;
    }),
];

export {
    registerValidators,
    loginValidator,
    changePasswordValidator,
} 
    
