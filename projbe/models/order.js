const mongoose=require("mongoose");
const{ObjectId}=mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    createdby:{
        type:ObjectId,
        ref:"User"
    },
    name: String,
    count: Number,
    price: Number,
});
const ProductCart=mongoose.model("ProductCart",ProductCartSchema);
const OrderSchema = new mongoose.Schema({
    product:ProductCartSchema,
    transaction_id:{},
    amount: Number,
    address: {},
    status: {
        type: String,
        default: "Received",
        enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Received"]
    },
    user:{
        type:ObjectId,
        ref:"User"
    },
    seller:{
        type:ObjectId,
        ref:"User"
    },
},
{timestamps: true}
);
const Order=mongoose.model("Order", OrderSchema);

module.exports= {Order,ProductCart};
