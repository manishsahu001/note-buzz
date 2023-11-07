const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const userSchema = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "MANISH_Love_SONA_$99261_$91098_$29235_$32291";
const authentication = require('../middleware/authentication');


// Create new user
router.post('/createuser',[
    body('name', "Name is 3 character long").isLength({min: 3}),
    body("email", "Please enter valid email").isEmail(),
    body("password", "Password must be at least 4 characters long").isLength({min: 4})
], async(req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(4001).json({error: error.message});
    }

    try {
        const {name, email, password} = req.body;
        
       const existing_user = await userSchema.findOne({email});
       if(existing_user){
            return res.status(400).json({error: "User already exist"})
       }

       const secured_password = await bcrypt.hash(password, 12);

        const add_user = await userSchema({
            name,
            email,
            password: secured_password,
        });
        const savedUser = await add_user.save();
        const data = {
            id: savedUser.id
        }
        
        const authToken = await jwt.sign(data.id, JWT_SECRET);
       return  res.status(201).json({success: true, authToken});
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
});

// Login user
router.post('/login', [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password at least 4 characters long").isLength({min: 4})
], async (req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(401).json({error: error.message})
    };

    try {
        const {email, password} = req.body;
        const user = await userSchema.findOne({email});
        const userPass = user.password;
        
        const matchPass = await bcrypt.compare(password, userPass);
        if(!user){
            return res.status(404).json({error: "User Does not exist"})
        }
        if(matchPass == false){
            return res.status(404).json({error: "Password is incorrect."});
        }

        const authToken =  jwt.sign(user.id, JWT_SECRET);
        return res.status(200).json({success: true, authToken})

    } catch (error) {
        return res.status(404).json({error: error.message});
    }
});

// Get user details
router.get('/getuser',authentication,  async (req, res)=>{
    try {
        const userId = req.user;
        console.log(userId);
        const user = await userSchema.findById(userId).select('-password');
        return res.status(200).json({user});
    } catch (error) {
        
    }
});


module.exports = router;