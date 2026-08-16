import { body } from "express-validator";

const createPurchaseOrderValidators = [
    body("supplier")
        .trim()
        .notEmpty()
        .withMessage("Supplier is required")
        .isMongoId()
        .withMessage("Invalid supplier id"),
    
    body("orderedItems")
        .isArray({min:1})
        .withMessage("Purchase order must contain atleast one product"),

    body("orderedItems.*.product")
        .trim()
        .notEmpty()
        .withMessage("Product is required")
        .isMongoId()
        .withMessage("Invalid product id"),
    
    body("orderedItems.*.orderedQuantity")
        .trim()
        .notEmpty()
        .withMessage("Order quantity is required")
        .isInt({min:1})
        .withMessage("Order quantity must be at least 1"),        

    body("orderedItems.*.unitCost")
        .notEmpty()
        .withMessage("Unit cost is required")
        .isFloat({min:0})
        .withMessage("Unit cost cannot be negative"),

    body("expectedDeliveryDate")
        .optional()
        .isISO8601()
        .withMessage("Expected delivery date must be a valid date"),

    body("notes")
        .optional()
        .trim()
        .isLength({max:500})
        .withMessage("Notes cannot exceed 500 characters"),

];


export {
    createPurchaseOrderValidators,
};