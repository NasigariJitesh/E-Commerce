const Category = require("../models/category");

exports.getCategoryById=(req,res,next,id) =>{
    Category.findById(id).exec((err,cate)=>{
        if(err){
            return res.status(400).json({
                err : "Category not found in DB"
            });
        }
        req.category = cate;
        next();
    });
};

exports.createCategory = (req,res) => {
    Category.findOne({name:req.body.name},(err,doc)=>{
        if(err){
            return res.status(400).json({
                err : "Not able to save category in DB"
            });
        }
        else if(doc){
            return res.json({
                error : "Category already exists"
            })
        }
        else{
            const category = new Category(req.body);
            category.save((err, category) => {
                if(err){
                    return res.status(400).json({
                        err : "Not able to save category in DB"
                    });
                }
                return res.json({category});
            });
        }
    });    
};

exports.getCategory = (req,res) => {
    return res.json(req.category);
};

exports.getAllCategory = (req,res) =>{
    Category.find().exec((err,categories) => {
        if(err){
            return res.status(400).json({
                err : "No categories found"
            });
        }
        res.json(categories);
    });
};

exports.updateCategory = (req,res) =>{
    const category = req.category;
    category.name =  req.body.name;

    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                err : "Failed to updated Category"
            });
        }
        res.json(updatedCategory);
    });
};

exports.removeCategory = (req,res)=>{
    const category = req.category;
    category.remove((err, category) => {
        if(err){
            return res.status(400).json({
                err : "Failed to delete Category"
            });
        }
        res.json({
            message:"successfully deleted the category : "+category.name
        });
    });
};