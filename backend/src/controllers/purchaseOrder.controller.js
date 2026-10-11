import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createPurchaseOrder as createPurchaseOrderService,
  getAllPurchaseOrders,
  getPurchseOrdersById,
  updatePurchseOrder as updatedPurchaseOrderService,
  cancelPurchaseOrder as cancelPurchaseOrderService,
} from "../services/purchaseOrder.service.js";
import { recordAuditLog } from "../services/auditLog.service.js";

const createPurchaseOrder = asyncHandler(async (req, resp) => {
  const purchaseOrder = await createPurchaseOrderService(
    req.body,
    req.user._id,
  );
  await recordAuditLog({ performedBy: req.user._id, action: "CREATE", collectionName: "PurchaseOrder", documentId: purchaseOrder._id, changes: { after: req.body } });

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
  await recordAuditLog({ performedBy: req.user._id, action: "UPDATE", collectionName: "PurchaseOrder", documentId: updatedPurchaseOrder._id, changes: { submitted: req.body } });

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
  await recordAuditLog({ performedBy: req.user._id, action: "STATUS_CHANGED", collectionName: "PurchaseOrder", documentId: cancelledPurchseOrder._id, changes: { status: cancelledPurchseOrder.status } });

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
