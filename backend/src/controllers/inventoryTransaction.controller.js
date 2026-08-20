import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  receivePurchaseOrder,
  getAllInventoryTransactions,
  adjustInventoryStock,
  damageInventoryStock,
  returnInventoryStock,
  sellInventoryStock,
} from "../services/inventoryTransaction.service.js";

const receivePurchaseOrderItems = asyncHandler(async (req, resp) => {
  const purchaseOrder = await receivePurchaseOrder(
    req.params.id,
    req.body,
    req.user._id,
  );

  return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { purchaseOrder },
        "Purchase order items received successfully",
      ),
    );
});

const getInventoryTransactions = asyncHandler(async (req, resp) => {
  const transactions = await getAllInventoryTransactions(req.query);

  return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { transactions },
        "Inventory transactions fetched successfully",
      ),
    );
});

const adjustStock = asyncHandler(async (req, resp) => {
  const result = await adjustInventoryStock(
    req.body.product,
    req.body,
    req.user._id,
  );

  return resp
    .status(200)
    .json(new ApiResponse(200, { result }, "Stock adjusted successfully"));
});

const damageStock = asyncHandler(async (req, resp) => {
  const result = await damageInventoryStock(
    req.body.product,
    req.body,
    req.user._id,
  );

  return resp
    .status(200)
    .json(new ApiResponse(200, { result }, "Stock damaged successfully"));
});

const returnStock = asyncHandler(async (req, resp) => {
  const result = await returnInventoryStock(
    req.body.product,
    req.body,
    req.user._id,
  );

  return resp
    .status(200)
    .json(new ApiResponse(200, { result }, "Stock returned successfully"));
});


const sellStock = asyncHandler(async (req, resp) => {
  const result = await sellInventoryStock(
    req.body.product,
    req.body,
    req.user._id,
  );

  return resp
    .status(200)
    .json(new ApiResponse(200, { result }, "Stock sold successfully"));
});





export {
  receivePurchaseOrderItems,
  getInventoryTransactions,
  adjustStock,
  damageStock,
  returnStock,
  sellStock
};
