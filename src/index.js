const express = require("express")
const app = express()
const path = require("path")
const cookieParser = require("cookie-parser")
const port = process.env.PORT || 8000
const hbs = require("hbs")
require("../src/db/conn")


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extende:false}))
const Router = require("../src/routers/router")
app.use(Router)



const staticPath = path.join(__dirname,"../public")
const tempaltePath = path.join(__dirname,"../templates/views")
const partialPath = path.join(__dirname,"../templates/partials")

app.use(express.static(staticPath))
app.set("view engine","hbs")
app.set("views",tempaltePath)
hbs.registerPartials(partialPath)

app.listen(port,()=>{
    console.log(`Connected to port ${port}`);
})