import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier as updatedSupplierService,
  updateSupplierStatus as updatedSupplierStatusService
} from "../services/supplier.service.js";

const addSupplier = asyncHandler(async (req, resp) => {
  const supplier = await createSupplier(req.body, req.user._id);

  return resp
    .status(201)
    .json(new ApiResponse(201, { supplier }, "Supplier created successfully"));
});

const getSuppliers = asyncHandler(async (req, resp) => {
  const suppliers = await getAllSuppliers(req.query);

  return resp
    .status(201)
    .json(
      new ApiResponse(201, { suppliers }, "Suppliers fetched successfully"),
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

  return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { Supplier: updatedSupplier },
        "Supplier updated successfully",
      ),
    );
});


const updateSupplierStatus = asyncHandler(async (req, resp)=>{
  const updatedSupplier = await updatedSupplierStatusService(req.params.id, req.body.isActive);
  
  return resp
    .status(200)
    .json(
      new ApiResponse(200, {supplier: updatedSupplier}, "Supplier updated successfully")
    )
})

export { addSupplier, getSuppliers, getSupplier, updateSupplier, updateSupplierStatus };
