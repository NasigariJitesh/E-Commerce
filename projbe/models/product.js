const mongoose=require("mongoose");
const User = require("./user");
const{ObjectId}=mongoose.Schema;
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true,
        unique:true
  },
  description:{
      type: String,
        required: true,
        maxlength: 3200,
        trim: true
  },
  price:{
        type: Number,
        required: true,
        maxlength: 32,
        trim: true
  },
  category:{
      type:ObjectId,
      ref:"Category",
      required: true
  },
  stock:{
      type: Number
  },
  sold:{
      type:Number,
      default: 0
  },
  photo:{
      data: Buffer,
      contentType: String
  },
  createdby:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required: true
  }
},
{timestamps: true}
);

module.exports=mongoose.model("Product", productSchema);