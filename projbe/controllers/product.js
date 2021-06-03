const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { isValidObjectId } = require("mongoose");


exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found"
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  const createdby= req.profile._id;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    const{name, description, price, category, stock} = fields;
  

    if(!name || !description || !price || !category || !stock){
      return res.status(400).json({
        error: "Please include all fields"
      });
    }
    let product = new Product(fields);
    product.createdby=createdby;
    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    
    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving tshirt in DB failed"
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct =(req,res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req,res,next) => {
  if(req.product.photo.data){
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req,res)=> {
  let product=req.product;
  if(!product.createdby==req.body.user){
    return res.status(400).json({
      error : "You are not Authorized to delete this Product"
    });
  }
  product.remove((err, deletedProduct) => {
    if(err){
      return res.status(400).json({
        err : "Failed to delete Product"
      });
    }
    res.json({
      message:"successfully deleted the product : "+deletedProduct.name
    });
  });
};

exports.updateProduct = (req, res) => {
  let product = req.product;
  if(!product.createdby==req.body.user){
    return res.status(400).json({
      error : "You are not Authorized to update this Product"
    });
  }
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //updation code
    
    product = _.extend(product, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed"
        });
      }
      res.json(product);
    });
  });
};

exports.getAllProducts = (req,res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 12;
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
  .select("-photo")
  .populate("category")
  .sort([[sortBy,"asc"]])
  .skip((page-1)*limit)
  .limit(limit)
  .exec((err,products) => {
    if(err) {
      return res.status(400).json({
        error: "No product found"
      });
    }
    res.json(products);
  });
};
exports.getAllProductsByUser = (req,res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 12;
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
 //console.log(req);
  const user_id=req.profile._id;
  
  Product.find({createdby:user_id})
  .select("-photo")
  .populate("createdby")
  .sort([[sortBy,"asc"]])
  .skip((page-1)*limit)
  .limit(limit)
  .exec((err,products) => {
    if(err) {
      return res.status(400).json({
        error: "No product found"
      });
    }
    else if(!products){
      return res.json({
        error: "0 product found"
      })
    }
    else{res.json(products)};
  });
};

exports.getProductsByCategories = (req,res)=> {
  Product.find({category:req.query.categoryId}, (err,products)=>{
    if(err) {
      return res.status(400).json({
        error: "No product found"
      });
    }
    else{
    res.json(products);}
  });
}



exports.updateStock = (req, res, next) => {
  req.body.order.products.forEach(product=>{
    const updatedstock = parseInt( product.stock)-parseInt(product.count);
    const updatedsold = parseInt( product.sold)+parseInt(product.count);
    Product.findByIdAndUpdate(product._id,
      { stock: updatedstock, sold: updatedsold } 
    ).then((res)=>{
      return res.json();
    },
    (err)=>{
      return res.status(400).json({
        error: "stock update operation failed"
      });
    },
    );
  });
  next();
};