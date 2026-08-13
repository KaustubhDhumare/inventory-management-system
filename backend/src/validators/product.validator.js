import { body } from "express-validator";

const createProductValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Product name must be between 3 to 50 characters"),

  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("SKU must be between 3 to 20 characters"),

  body("description")
    .trim()
    .optional()
    .isLength({ max: 300 })
    .withMessage("Description must be at most 300 characters long"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isFloat({ min: 0 })
    .withMessage("Quantity cannot be negative"),

  body("minimumStock")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum stock cannot be negative"),

  body("unit")
    .optional()
    .isIn(["piece", "kg", "liter", "box"])
    .withMessage("Unit must be one of: piece, kg, liter, box"),
];


const updateProductValidators = [
  body("name")
    .trim()
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Product name must be between 3 to 50 characters"),

  body("sku")
    .trim()
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("SKU must be between 3 to 20 characters"),

  body("description")
    .trim()
    .optional()
    .isLength({ max: 300 })
    .withMessage("Description must be at most 300 characters long"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),

  body("quantity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Quantity cannot be negative"),

  body("minimumStock")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum stock cannot be negative"),

  body("unit")
    .optional()
    .isIn(["piece", "kg", "liter", "box"])
    .withMessage("Unit must be one of: piece, kg, liter, box"),

  body("category")
    .trim()
    .optional()
    .notEmpty()
    .withMessage("Category cannot be empty"),

  body("supplier")
    .trim()
    .optional()
    .notEmpty()
    .withMessage("Supplier cannot be empty"),

  body().custom((value) => {
    if (
      value.name === undefined &&
      value.sku === undefined &&
      value.description === undefined &&
      value.price === undefined &&
      value.quantity === undefined &&
      value.minimumStock === undefined &&
      value.unit === undefined &&
      value.category === undefined &&
      value.supplier === undefined
    ) {
      throw new Error("At least one field is required for update");
    }

    return true;
  }),
];

const updateProductStatusValidators = [
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

export {
    createProductValidators,
    updateProductValidators,
    updateProductStatusValidators,
  }