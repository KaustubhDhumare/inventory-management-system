import mongoose from "mongoose";


const orderedItemSchema  = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        orderedQuantity: {
            type: Number,
            required: true,
            min: [1, "Order quantity must be at least 1"]
        },
        recievedQuantity: {
            type: Number,
            required: true,
            min: [0, "Recieved quantity cannot be negative"]
        },
        unitCost: {
            type: Number,
            required: true,
            min: [0, "Unit cost cannot be negative"]
        }
    },
    {
        _id: false
    }
);



const purchaseOrderSchema = new mongoose.Schema(
    {
        poNumber: {
            type: String,
            unique: true,
            index: true
        },
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true
        },
        orderBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        orderedItem: {
            type: [orderedItemSchema],
            validate: {
                validator: function (items){
                    return items.length > 0 ;
                },
                message: "Purchase order must contain at least one product"
            },
        },
        totalAmount: {
            type: Number,
            default: 0,
            min: [0, "Total amount cannot be negative"]
        },
        status: {
            type: String,
            enum: [
                "Pending",
                "Partially recieved",
                "Complete",
                "Cancelled"
            ],
            default: "Pending",
        },
        expectedDeliveryDate: {
            type: Date,
        },
        notes: {
            type: String,
            trim: true,
            maxlenght: [500, "Notes cannot exceed 500 characters"]
        }
    },
    {
        timestamps: true
    }
)


const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);


export default PurchaseOrder;

