import { body } from "express-validator";

const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Category name must be between 3 and 50 characters"),

  body("description")
    .trim()
    .optional()
    .isLength({ max: 300 })
    .withMessage("Description must be at most 300 characters long"),
];

const updateCategoryValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Category name must be between 3 and 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Description must be at most 300 characters long"),

  body().custom((value) => {
    if (value.name === undefined && value.description === undefined) {
      throw new Error("At least one field is required for update");
    }
    return true
  }),
];


const updateCategoryStatusValidator = [
    body("isActive")
        .exists()
        .withMessage("Status is required")
        .isBoolean()
        .withMessage("Status must be either true or false.")
        .custom((value)=>{
          if(typeof value !== "boolean"){
            throw new Error ("Status must be a boolean.")
          }
          return true
        })
];

export { createCategoryValidator, updateCategoryValidator, updateCategoryStatusValidator };
