const { body } = require("express-validator");
const {Order,ProductCart} = require("../models/order");

exports.getOrderById = (req,res,next,id)=> {
    Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order)=>{
        if (err) {
            return res.status(400).json({
                error: "No order found"
            });
        }
        req.order = order;
        next();
    });
};

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = {...req.body.order}
    order.products.forEach(product => {
        const thisorder = new Order(req.body.order);
        thisorder.product=product;
        thisorder.seller=product.createdby;
        thisorder.save((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "Failed to save your order in DB"
                });
            }
            else{
            res.json(order);}
        });
    });
};
exports.getAllOrders = (req,res)=>{
    const user_id=req.profile._id;
    Order.find({seller:user_id})
    .populate("user", "_id name createdby")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
              error: "Failed to find orders"
            });
        }
       
        res.json(order);
    });
};
exports.getOrders = (req,res)=>{
    const user_id=req.profile._id;
    Order.find({user:user_id})
    .populate("user", "_id name")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
              error: "Failed to find orders"
            });
        }
        res.json(order);
    });
};

exports.getOrderStatus= (req,res)=>{
    res.json(Order.schema.path("status"));
};

exports.updateStatus=(req,res)=>{
    console.log(req.body);
    Order.update(
        {_id: req.body.orderId},
        {status: req.body.status},
        (err,order)=>{
            if(err){
                return res.status(400).json({
                  error: "Failed to update order status"
                });
            }
            res.json(order);
        }
    );
};
