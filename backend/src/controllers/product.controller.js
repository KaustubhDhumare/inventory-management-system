import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct as updateProductService,
  updateProductStatus as updateProductStatusService,
} from "../services/product.service.js";
import { recordAuditLog } from "../services/auditLog.service.js";

const addProduct = asyncHandler(async (req, resp) => {
  const product = await createProduct(req.body, req.user._id);
  await recordAuditLog({ performedBy: req.user._id, action: "CREATE", collectionName: "Product", documentId: product._id, changes: { after: req.body } });

  return resp
    .status(200)
    .json(new ApiResponse(200, { product }, "Product created successfully"));
});

const getProducts = asyncHandler(async (req, resp) => {
  const products = await getAllProducts(req.query, req.user.role);

  return resp
    .status(200)
    .json(new ApiResponse(200, { products }, "Products fetched successfully"));
});

const getProduct = asyncHandler(async (req, resp) => {
  const product = await getProductById(req.params.id);

  return resp
    .status(200)
    .json(new ApiResponse(200, { product }, "Product fetched successfully"));
});

const updateProduct = asyncHandler(async (req, resp) => {
  const updatedProduct = await updateProductService(req.params.id, req.body);
  await recordAuditLog({ performedBy: req.user._id, action: "UPDATE", collectionName: "Product", documentId: updatedProduct._id, changes: { submitted: req.body } });

  return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { product: updatedProduct },
        "Product updated successfully",
      ),
    );
});

const updateProductStatus = asyncHandler(async (req, resp) => {
  const updatedProduct = await updateProductStatusService(
    req.params.id,
    req.body.isActive,
  );
  await recordAuditLog({ performedBy: req.user._id, action: "STATUS_CHANGED", collectionName: "Product", documentId: updatedProduct._id, changes: { isActive: updatedProduct.isActive } });

  return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { product: updatedProduct },
        "Product updated successfully",
      ),
    );
});

export {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  updateProductStatus,
};
