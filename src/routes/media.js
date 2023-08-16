const express = require("express")
const multer = require("multer")
const auth = require('../middlewares/auth')
const Media = require('../models/media')

const router = express.Router()

const upload = multer({
    limits:{
        fileSize:10000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('file must be an image'))
        }
        cb(undefined,true)
    }
})

router.post('', auth, upload.single('image'), async(req,res)=>{
    try{
        const image = new Media({
            image:req.file.buffer,
            description:req.body.description,
            owner:req.user._id
        })
        await image.save()
        res.send("image saved")
    }catch(e){
        res.status(400).send('error')
    }
})


router.get('',auth,async (req,res)=>{

    try{
        const sort = {}
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1:1
        }
        await req.user.populate({
            path:'Media',
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.Media)
    }catch(e){
        res.status(400).send("error")
    }
    
})


router.delete('/:id',auth,async(req,res)=>{
    try{
        const image = await Media.findOneAndDelete({_id:req.params.id})
        if(!image){
            return res.status(400).send('invalid request')
        }
        res.send('image deleted successfully')
    }
    catch(e){
        res.status(400).send('invalid request')
    }
})

router.patch('/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    if(!(updates[0]==='description')){
        return res.status(400).send('invalid update')
    }
    try{
        const image = await Media.findById(req.params.id)
        image.description = req.body.description
        await image.save()
        res.send("image updated")
    } catch(e){
        res.status(400).send("invalid request")
    }

})

module.exports = router