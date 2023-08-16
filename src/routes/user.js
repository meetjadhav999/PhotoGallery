const express = require("express")
const bcrypt = require("bcryptjs")
const User = require("../models/user")
const Media = require("../models/media")

const auth = require("../middlewares/auth")

const router = express.Router()


router.get("/user",auth, async (req,res)=>{
    res.send(req.user)
})


router.post("/register",async (req,res)=>{
    try{
        const user = new User(req.body)

        await user.save()
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send("error")
    }
    
})

router.post("/login", async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        if(!user){
            return res.status(400).send("invalid email or password")
        }
        res.send(user)
    }catch(e){
        res.status(400).send("error")
    }
})
router.patch('/changepassword',auth,async(req,res)=>{
    const curPassword = req.body.curPassword
    const newPassword = req.body.newPassword
    try{
        const user = await User.findById(req.user._id)

        const ismatched = await bcrypt.compare(curPassword,user.password)
        if(!ismatched){
            return res.status(400).send("password does not match")
        }
        user.password = newPassword
        user.save()
        res.send(user)
    }
    catch(e){
        res.status(400).send('something went wrong')
    }
    
})

router.delete("/logout",auth,async(req,res)=>{
    req.user.tokens=[]
    req.user.save()
    res.send("loged out successfully")
})

module.exports = router