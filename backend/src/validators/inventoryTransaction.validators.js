import { body, query } from "express-validator";
import INVENTORY_TRANSACTION_TYPE from "../constants/inventoryTransactionType.js";

const receivePurchseOrderValidators = [
  body("items")
    .exists()
    .withMessage("Items are required")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),

  body("items.*.product")
    .exists()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid product id"),

  body("items.*.receivedQuantity")
    .exists()
    .withMessage("Received quantity is required")
    .isInt({ min: 1 })
    .withMessage("Received quantity must be at least 1"),

  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Remarks cannot exceed 500 characters"),
];

const getInventoryTransactionValidators = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("product").optional().isMongoId().withMessage("Invalid product id"),

  query("purchaseOrder")
    .optional()
    .isMongoId()
    .withMessage("Invalid purchase order id"),

  query("type")
    .optional()
    .isIn(Object.values(INVENTORY_TRANSACTION_TYPE))
    .withMessage("Invalid inventory transaction type"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

export { receivePurchseOrderValidators, getInventoryTransactionValidators };
