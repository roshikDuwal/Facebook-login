const mongoose = require("mongoose")
const bycryptjs = require("bcryptjs")
const jwt =require("jsonwebtoken")

const practiceSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    confirmpassword:{
        type:String,
        required:true,
        minlength:8
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

practiceSchema.methods.tokengeneration= async function(next){
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token})
        await this.save();
        return token
    } catch (error) {
        res.send(error)
    }
}

practiceSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password =  await bycryptjs.hash(this.password,12)
        this.confirmpassword = await bycryptjs.hash(this.password,12)
    }
    next();
})

const pracriceModel = new mongoose.model("practicedata",practiceSchema)

module.exports = pracriceModel