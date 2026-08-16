import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createPurchaseOrder as createPurchaseOrderService,
  getAllPurchaseOrders,
  getPurchseOrdersById,
  updatePurchseOrder as updatedPurchaseOrderService,
  cancelPurchaseOrder as cancelPurchaseOrderService,
} from "../services/purchaseOrder.service.js";

const createPurchaseOrder = asyncHandler(async (req, resp) => {
  const purchaseOrder = await createPurchaseOrderService(
    req.body,
    req.user._id,
  );

  return resp
    .status(201)
    .json(
      new ApiResponse(
        201,
        { purchaseOrder },
        "Purchase order created successfully",
      ),
    );
});

const getPurchseOrders = asyncHandler(async (req, resp) => {
  const purchaseOrders = await getAllPurchaseOrders(req.query);

  return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { purchaseOrders },
        "Purchase orders fetched successfully",
      ),
    );
});

const getPurchaseOrder = asyncHandler(async (req, resp) => {
  const purchaseOrder = await getPurchseOrdersById(req.params.id);

  return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { purchaseOrder },
        "Purchase order fetched successfully",
      ),
    );
});

const updatePurchseOrder = asyncHandler(async (req, resp) => {
  const updatedPurchaseOrder = await updatedPurchaseOrderService(
    req.params.id,
    req.body,
  );

  return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { purchaseOrder: updatedPurchaseOrder },
        "Purchase order updated successfully",
      ),
    );
});

const cancelPurchaseOrder = asyncHandler(async (req, resp) => {
  const cancelledPurchseOrder = await cancelPurchaseOrderService(req.params.id);

  return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { purchaseOrder: cancelledPurchseOrder },
        "Purchase order cancelled successfully",
      ),
    );
});

export {
  createPurchaseOrder,
  getPurchseOrders,
  getPurchaseOrder,
  updatePurchseOrder,
  cancelPurchaseOrder,
};
