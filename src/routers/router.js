const express = require("express")
const practiceModel = require("../models/models")
const bycryptjs = require("bcryptjs")
const auth = require("../middleware/auth")
const router = express.Router()

router.get("/",(req,res)=>{
    res.render("login")
})

router.get("/createaccount",(req,res)=>{
    res.render("createaccount")
})

router.get("/home",auth,(req,res)=>{
    res.render("home")
})
router.post("/createaccount",async (req,res)=>{
    try {
        password= req.body.password
        confirmpassword=req.body.confirmpassword
        if(password === confirmpassword){
            const getdata = new practiceModel({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                password:req.body.password,
                confirmpassword:req.body.confirmpassword
            })

            // middleware for passing password

            //middleware for token generation
            const token = await getdata.tokengeneration();

            res.cookie("jwt",token,{
                expires:new Date(Date.now() + 50000),
                httpOnly:true
            })

            const saveddata = await getdata.save()
            res.status(201).render("login")
        }else{
            res.send("Password dont match")
        }
    } catch (error) {
        res.status(400).send(error)
        console.log(error);
    }
})

router.post("/",async (req,res)=>{
    try {
        const password = req.body.password
        const email = req.body.email

        const userdata = await practiceModel.findOne({email:email})

        const isMatch =await bycryptjs.compare(password,userdata.password)

        const token = await userdata.tokengeneration();

        res.cookie("loginjwt",token,{
            expires:new Date(Date.now() + 1000000),
            httpOnly:true
        })

        if(isMatch){
            res.render("home")
        }else{
            res.send("Password donot match!!!")
        }
    } catch (error) {
        res.status(400).send(error)
        console.log(error);
    }
})

router.get("/logout",auth,async(req,res)=>{
    try {
       
        req.user.tokens = req.user.tokens.filter((currelement)=>{
            return currelement.token != req.token
        })
        res.clearCookie("loginjwt")
        await req.user.save()
        res.render("login")
    } catch (error) {
        res.status(400).send(error)
        
    }
})

router.get("/signout",auth,async(req,res)=>{
    try {
        req.user.tokens = []
        res.clearCookie("loginjwt")
        await req.user.save()
        res.render("login")
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router