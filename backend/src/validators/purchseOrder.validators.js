import { body } from "express-validator";
import PURCHASE_ORDER_STATUS from "../constants/purchaseOrderStatus.js";

const createPurchaseOrderValidators = [
  body("supplier")
    .trim()
    .notEmpty()
    .withMessage("Supplier is required")
    .isMongoId()
    .withMessage("Invalid supplier id"),

  body("orderedItems")
    .isArray({ min: 1 })
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
    .isInt({ min: 1 })
    .withMessage("Order quantity must be at least 1"),

  body("orderedItems.*.unitCost")
    .notEmpty()
    .withMessage("Unit cost is required")
    .isFloat({ min: 0 })
    .withMessage("Unit cost cannot be negative"),

  body("expectedDeliveryDate")
    .optional()
    .isISO8601()
    .withMessage("Expected delivery date must be a valid date"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

const updatePurchaseOrderValidators = [
  body("supplier")
    .trim()
    .optional()
    .notEmpty()
    .withMessage("Supplier cannot be empty"),

  body("orderedItems")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Purchase order must contain at least one item"),

  body("orderedItems.*.product")
    .if(body("orderedItems").exists())
    .trim()
    .notEmpty()
    .withMessage("Product is required for every ordered item"),

  body("orderedItems.*.orderedQuantity")
    .if(body("orderedItems").exists())
    .isInt({ min: 1 })
    .withMessage("Ordered quantity must be at least 1"),

  body("orderedItems.*.unitCost")
    .if(body("orderedItems").exists())
    .isFloat({ min: 0 })
    .withMessage("Unit cost cannot be negative"),

  body("expectedDeliveryDate")
    .optional()
    .isISO8601()
    .withMessage("Expected delivery date must be a valid date"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),

  body().custom((value) => {
    if (
      value.supplier === undefined &&
      value.orderedItems === undefined &&
      value.expectedDeliveryDate === undefined &&
      value.notes === undefined
    ) {
      throw new Error("At least one field is required for update");
    }
    return true;
  }),
];

const cancelPurchaseOrderValidator = [
  body("status")
    .exists()
    .withMessage("Status is required")
    .custom((value) => {
      if (value !== PURCHASE_ORDER_STATUS.CANCELLED) {
        throw new Error("Purchase order can only be cancelled");
      }
      return true;
    }),
];

export {
  createPurchaseOrderValidators,
  updatePurchaseOrderValidators,
  cancelPurchaseOrderValidator,
  
};
