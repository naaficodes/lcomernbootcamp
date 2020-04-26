const User = require("../models/user");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

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


exports.signin=(req,res)=>{
   const {email,password}=req.body;
   const errors = validationResult(req)
   if(!errors.isEmpty()){
        return res.status(422).json({
           error: errors.array()[0].msg
       })
   }

   User.findOne({email},(err,user)=>{
        if(err || !user)
        {
          return res.status(400).json({
                message:"User email does not exist"
            })
        }
        if(!user.authenticate(password)){
           return res.status(401).json({
                message:"Email and password do not match"
            });
        }

        // create token
        const token = jwt.sign({_id:user._id},process.env.SECRET);
        //put token in cookie
        res.cookie("token",token,{expries:new Date()+9999});

        //send response to front end
        const{_id,name,email,role}=user;
        return res.json({
            token, user:{_id,name,email,role}
        });

   });

};

exports.signout=(req,res)=>{
    res.clearCookie("token");
    res.json({
        message:"user signout successful"
    });
};


//protected routes
exports.isSignedIn = expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth"
});

//custom middleware
exports.isAuthenticated = (req,res,next)=>{
    //req.profile and is set from frontend.
    //req.auth is set from isSignedIn middleware defined up.
    //req.profile._id is also set from frontend.
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            message:"Access Denied"
        })
    }
    next();
}

exports.isAdmin = (req,res,next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({
            message:"You are not ADMIN, Access Denied"
        })
    }
    next();
}