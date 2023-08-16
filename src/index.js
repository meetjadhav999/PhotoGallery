const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require('./routes/user')
const mediaRoutes = require('./routes/media')

mongoose.connect('mongodb://127.0.0.1:27017/PhotoGallery')


const app = express()

app.use(express.json())
app.use(userRoutes)
app.use('/media',mediaRoutes)
app.get('',(req,res)=>{
    res.send("Hello")
})

app.listen(3000,()=>{
    console.log("Server running on port 3000")
})