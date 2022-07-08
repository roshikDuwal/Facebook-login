require("dotenv").config()
const jwt = require("jsonwebtoken")
const practiceModel = require("../models/models")

const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.loginjwt;
        const verifydata =jwt.verify(token,process.env.SECRET_KEY)
        const user = await practiceModel.findOne({_id:verifydata._id})
        
        req.token = token
        req.user = user

        next();
    } catch (error) {
        res.status(400).send(error)
    }

 
}


module.exports = auth