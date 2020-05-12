const Category = require("../models/category")

exports.getCategoryById=(req,res,next,id)=>{
    Category.findById(id).exec((err,cate)=>{
        if(err){
            return res.status(400).json({
                error:"Category not found in DB"
            })
        }
        req.category = cate;
        next();
    })
   
}

exports.createCategory=(req,res)=>{
    const category = new Category(req.body);
    category.save((err,category)=>{ 
        if(err){
            return res.status(400).json({
                error:"Not able to save category in DB"
            });
        }
        res.json({category});
    });
}

exports.getCategory=(req,res)=>{
    return res.json(req.category);
};

exports.getAllCategory=(req,res)=>{
    Category.find().exec((err,categories)=>{
        if(err){
            return res.status(400).json({
                error:"No Categories found !"
            });
        }
        res.json(categories);
    });
};

exports.updateCategory=(req,res)=>{
    const category = req.category;
    category.name=req.body.name;
    //as req.category is an object of Category model
    //no need to call the Category model to perform save
    category.save((err,updatedCategory)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to update to category"
            });
        }
        res.json(updatedCategory);
    })
}

exports.removeCategory=(req,res)=>{
    const category = req.category;
    category.remove((err,category)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to remove category"
            });
        }
        res.json({
            message:"Successfully deleted"
        });
    });
};