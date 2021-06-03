var express = require('express');
var router = express.Router();
const {check,validationResult} = require('express-validator');
const {signout, signup, signin, isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

router.post(
    "/signup", 
    [
    check("name","name should be atleast 3char long").isLength({ min: 3 }),
    check("email","enter a valid email").isEmail(),
    check("password","password must be atleast 6char long").isLength({ min: 6 }),
], 
signup
);

router.post(
    "/signin", 
    [
        check("email","enter a valid email").isEmail(),
        check("password","password field is compulsory").isLength({ min: 1}),
    ], 
    signin
);

router.get("/signout", signout);



module.exports=router;