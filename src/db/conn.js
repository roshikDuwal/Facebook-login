require("dotenv").config()
const mongoose = require("mongoose")


mongoose.connect(process.env.CONNECT)
.then(()=>{
    console.log("Connected to db");
}).catch((error)=>{
    res.status(401).send(error)
})