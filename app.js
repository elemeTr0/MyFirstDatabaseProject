require("dotenv").config();
const express = require("express");
const loginRouter = require("./routes/loginRoute");
const signupRouter = require("./routes/signupRoute");
const app = express();
const { Result } = require("pg");
const session = require("express-session");
const profileRouter = require("./routes/profileRoute");
const homeRouter = require("./routes/homeRoute");

app.use(express.urlencoded({extended:true}))

app.set("view engine", "ejs")

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false
}))
app.use("/", loginRouter)
app.use("/", signupRouter)
app.use("/", profileRouter)
app.use("/", homeRouter)

app.use((req,res) =>{
    res.status(404).render("404");
})

const PORT = process.env.PORT || 3000;

app.get("/", (req,res) => {
    console.log("opened /")
    res.render("index")
})

app.listen(PORT)