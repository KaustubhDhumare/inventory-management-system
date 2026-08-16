import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createPurchaseOrder as createPurchaseOrderService, getAllPurchaseOrders } from "../services/purchaseOrder.service.js";

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


const getPurchseOrders = asyncHandler(async (req, resp)=>{
  const purchaseOrder = await getAllPurchaseOrders(req.query);

    return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { purchaseOrder },
        "Purchase order fetched successfully",
      ),
    );  
})

export { createPurchaseOrder, getPurchseOrders };
