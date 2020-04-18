const User = require("../models/user");
const { check, validationResult } = require('express-validator');

exports.signup=(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
   const user = new User(req.body);
   user.save((err, user)=>{
       if(err){
           return res.status(400).json({
               message:"Not able to save the user in the DB"
           })
       }
       res.json({
           name:user.name,
           email:user.email,
           id:user._id
       });
   });
};


exports.signout=(req,res)=>{
    res.json({
        message:"user signout successful",
    });
};

