const User = require("../models/user");
const {check,validationResult} = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup=(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    const user = new User(req.body);
    user.save((error,user)=> {
        if (error) {
            return res.status(400).json({
                error: "email already in use"
            }); 
        }
        res.json({
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            id: user._id
            });
    });
};

exports.signin=(req,res)=>{
    const{email,password} = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "USER email doesn't exist"
            });
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "email and password doesn't match"
            });
        }

        //create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET);
        //put token in cookie
        res.cookie("token", token, {expire: new Date()+9999});

        //send response to front end
        const {_id,name,email,role,lastname} = user;
        return res.json({token, user: {_id,name,email,role,lastname} });

    });

};


exports.signout=(req,res)=>{
    res.clearCookie("token");
    res.json({
        message : "User signout successfully"
    });
};

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['SHA256','RS256','sha1', 'HS256'],
    userProperty: "auth"
});


//custom middlewares
exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "Access Denied"
        });
    }
    next();
};

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "Not an Admin, Access Denied"
        });
    }
    next();
};