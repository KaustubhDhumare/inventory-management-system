import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier as updatedSupplierService,
  updateSupplierStatus as updatedSupplierStatusService
} from "../services/supplier.service.js";
import { recordAuditLog } from "../services/auditLog.service.js";

const addSupplier = asyncHandler(async (req, resp) => {
  const supplier = await createSupplier(req.body, req.user._id);
  await recordAuditLog({ performedBy: req.user._id, action: "CREATE", collectionName: "Supplier", documentId: supplier._id, changes: { after: req.body } });

  return resp
    .status(200)
    .json(new ApiResponse(200, { supplier }, "Supplier created successfully"));
});

const getSuppliers = asyncHandler(async (req, resp) => {
  const suppliers = await getAllSuppliers(req.query, req.user.role);

  return resp
    .status(200)
    .json(
      new ApiResponse(200, { suppliers }, "Suppliers fetched successfully"),
    );
});

const getSupplier = asyncHandler(async (req, resp) => {
  const supplier = await getSupplierById(req.params.id);

  return resp
    .status(200)
    .json(new ApiResponse(200, { supplier }, "Supplier fetched successfully"));
});

const updateSupplier = asyncHandler(async (req, resp) => {
  const updatedSupplier = await updatedSupplierService(req.params.id, req.body);
  await recordAuditLog({ performedBy: req.user._id, action: "UPDATE", collectionName: "Supplier", documentId: updatedSupplier._id, changes: { submitted: req.body } });

  return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { supplier: updatedSupplier },
        "Supplier updated successfully",
      ),
    );
});


const updateSupplierStatus = asyncHandler(async (req, resp)=>{
  const updatedSupplier = await updatedSupplierStatusService(req.params.id, req.body.isActive);
  await recordAuditLog({ performedBy: req.user._id, action: "STATUS_CHANGED", collectionName: "Supplier", documentId: updatedSupplier._id, changes: { isActive: updatedSupplier.isActive } });
  
  return resp
    .status(200)
    .json(
      new ApiResponse(200, {supplier: updatedSupplier}, "Supplier updated successfully")
    )
})

export { addSupplier, getSuppliers, getSupplier, updateSupplier, updateSupplierStatus };
