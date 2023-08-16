const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const auth = async (req,res,next) =>{
    try{
        const token = req.header("Authorization").replace("Bearer ",'')
        const decoded = jwt.verify(token,'meetjadhav')
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error("invalid authentication")
        }
        req.user = user
        next()
    }catch(e){
        res.status(400).send("please authenticate")
    }
}

module.exports = auth