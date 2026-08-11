import { body } from "express-validator";

const createSupplierValidator = [
  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("Comapny name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Comapny name must be between 3 and 50 characters"),

  body("contactPerson")
    .trim()
    .notEmpty()
    .withMessage("Contact person name is required")
    .isLength({ max: 50 })
    .withMessage("Contact person name cannot exceed 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide valid email address")
    .normalizeEmail(),

  body("phoneNo")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Please provide a valid phone number."),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 300 })
    .withMessage("Address must be at most 300 characters long"),
];

const updateSupplierValidator = [
  body("companyName")
    .trim()
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Comapny name must be between 3 and 50 characters"),

  body("contactPerson")
    .trim()
    .optional()
    .isLength({ max: 50 })
    .withMessage("Contact person name cannot exceed 50 characters"),

  body("email")
    .trim()
    .optional()
    .isEmail()
    .withMessage("Please provide valid email address")
    .normalizeEmail(),

  body("phoneNo")
    .trim()
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Please provide a valid phone number."),

  body("address")
    .trim()
    .optional()
    .isLength({ max: 300 })
    .withMessage("Address must be at most 300 characters long"),

  body().custom((value) => {
    if (
      value.companyName === undefined &&
      value.contactPerson === undefined &&
      value.email === undefined &&
      value.phoneNo === undefined &&
      value.address === undefined
    ) {
      throw new Error("At least one field is required for update");
    }
    return true;
  }),
];


const updateSupplierStatusValidators = [
  body('isActive')
    .exists()
    .withMessage("Status is required")
    .isBoolean()
    .withMessage("Status must be either true or false")
    .custom((value)=>{
      if(typeof value !== "boolean"){
        throw new Error ("Status must be boolean")
      }
      return true 
    })
]

export { createSupplierValidator, updateSupplierValidator, updateSupplierStatusValidators };
