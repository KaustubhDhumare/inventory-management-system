import mongoose, { Query } from "mongoose";
import Supplier from "../models/supplier.model.js";
import ApiError from "../utils/ApiError.js";
import validateObjectId from "../utils/validateObjectId.js";
import { getSuppliers } from "../controllers/supplier.controller.js";

const createSupplier = async (supplierData, createdBy) => {
  const { companyName, contactPerson, email, phoneNo, address } = supplierData;

  const normalisedName = companyName.trim().toLowerCase();

  const existingSupplier = await Supplier.findOne({
    $or: [{ companyName: normalisedName }, { email }, { phoneNo }],
  });

  if (existingSupplier) {
    if (existingSupplier.companyName === normalisedName) {
      throw new ApiError(409, "Comapny name already exists");
    }
    if (existingSupplier.email === email) {
      throw new ApiError(409, "Email already exists");
    }
    if (existingSupplier.phoneNo === phoneNo) {
      throw new ApiError(409, "Phone number already exists");
    }
  }

  const supplier = await Supplier.create({
    companyName: normalisedName,
    contactPerson,
    email,
    phoneNo,
    address,
    createdBy,
  });

  return supplier;
};

const getAllSuppliers = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "companyName",
    sortOrder = "asc",
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const filter = {
    isActive: true,
  };

  if (search.trim()) {
    filter.companyName = {
      $regex: search,
      $options: "i",
    };
  }

  const totalDocumnet = await Supplier.countDocuments(filter);

  const suppliers = await Supplier.find(filter)
    .sort({
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    })
    .skip(skip)
    .limit(limitNumber);

  return {
    suppliers,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalDocumnet,
      totalPages: Math.ceil(totalDocumnet / limitNumber),
    },
  };
};

const getSupplierById = async (supplierId) => {
  validateObjectId(supplierId, "supplier id");

  const supplier = await Supplier.findOne({
    _id: supplierId,
    isActive: true,
  });

  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }

  return supplier;
};

const updateSupplier = async (supplierId, updateData) => {
  validateObjectId(supplierId, "supplier id");

  const supplier = await Supplier.findById(supplierId);

  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }

  const { companyName, contactPerson, email, phoneNo, address } = updateData;

  const allowedUpdates = {};
  if (companyName !== undefined) {
    const normalisedCompanyName = companyName.trim().toLowerCase();

    if (!normalisedCompanyName) {
      throw new ApiError(400, "Comapany nama cannot be empty");
    }
    const existingSupplier = await Supplier.findOne({
      companyName: normalisedCompanyName,
      _id: {
        $ne: supplierId,
      },
    });

    if(existingSupplier){
      throw new ApiError(409, "Supplier with this company name already exists")
    }
    allowedUpdates.companyName = normalisedCompanyName
  }
    if (contactPerson !== undefined) {
    const normalizedContactPerson = contactPerson.trim();

    if (!normalizedContactPerson) {
      throw new ApiError(400, "Contact person cannot be empty");
    }

    allowedUpdates.contactPerson = normalizedContactPerson;
  }

  if (email !== undefined) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingSupplier = await Supplier.findOne({
      email: normalizedEmail,
      _id: { $ne: supplierId },
    });

    if (existingSupplier) {
      throw new ApiError(
        409,
        "Supplier with this email already exists"
      );
    }

    allowedUpdates.email = normalizedEmail;
  }


   if (phoneNo !== undefined) {
    const normalizedPhone = phoneNo.trim();

    const existingSupplier = await Supplier.findOne({
      phoneNo: normalizedPhone,
      _id: { $ne: supplierId },
    });

    if (existingSupplier) {
      throw new ApiError(
        409,
        "Supplier with this phone number already exists"
      );
    }

    allowedUpdates.phoneNo = normalizedPhone;
  }

  if (address !== undefined) {
    allowedUpdates.address = address.trim();
  }

  const updatedSupplier = await Supplier.findByIdAndUpdate(
    supplierId,
    allowedUpdates,
    {
      new: true,
      runValidators: true
    },
  );

  return updatedSupplier
};


const updateSupplierStatus = async(supplierId, isActive)=> {
  validateObjectId(supplierId, "supplier id")
  const supplier = await Supplier.findById(supplierId);
  if(!supplier){
    throw new ApiError(404, "Supplier not found");
  }

  if(supplier.isActive === isActive){
    throw new ApiError(400, `Supplier is already ${isActive ? "active" : "inactive"}`);
  }

  const updatedSupplier = await Supplier.findByIdAndUpdate(
    supplierId,
    {isActive},
    {
      new: true,
      runValidators: true,
    },
  );
  return updatedSupplier;
};


export { createSupplier, getAllSuppliers, getSupplierById, updateSupplier, updateSupplierStatus };
