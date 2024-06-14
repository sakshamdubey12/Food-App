const express = require('express');
const router = express.Router();
const User  = require('../models/User');
const {body, vlidationResult, validationResult} = require('express-validator');


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = 'hckshdjmndnvfhvkjhkvfhkjshd'

router.post("/createuser", 
[body('email','This email does not exists').isEmail(),
body('name').isLength({min:2}),
body('password','Password must be atleast 6 characters').isLength({min:6})],

async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array() });
    }
    

    const salt  = await bcrypt.genSalt(10);
    let securePassword = await bcrypt.hash(req.body.password,salt)
    try{
        await User.create({
            name: req.body.name,
            password: securePassword,
            email: req.body.email,
            location: req.body.location, 
        })
        res.json({success:true})

    }catch(error){
        console.log(error);
        res.json({success:false});

    }
})


router.post("/loginuser",
[body('email','This email does not exists').isEmail(),
body('password','Password must be atleast 6 characters').isLength({min:6})], 
async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array() });
    }
    let email = req.body.email
    try{
        let userData = await User.findOne({email});
        if(!userData){
            return res.status(400).json({errors:'username or password incorrect!' });
        }
        
        const pwdCompare = await bcrypt.compare(req.body.password,userData.password)
        if(!pwdCompare){
            return res.status(400).json({errors:'password incorrect!' });
        }
        const data = {
            user:{
                id:userData.id
            }
        }
        const authToken = jwt.sign(data,jwtSecret);
        return res.json({success:true,authToken:authToken});

    } catch(error){
        console.log(error);
        res.json({success:false});

    }
})


module.exports = router;