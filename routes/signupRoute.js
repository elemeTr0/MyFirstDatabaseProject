const { Router } = require ("express")
const pool = require("../db/pool")
const bcrypt = require("bcrypt")
const {body, validationResult} = require("express-validator")

const signupRouter = Router()

signupRouter.get("/signup", (req,res)=>{
    console.log("opened /signup")
    res.render("signupPage", {errors: null, username: null, email: null})
})

signupRouter.post("/signup",[
    body("username").trim().isLength({min:3}).withMessage("Username must be at least 3 characters"),
    body("email").trim().isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({min:8}).withMessage("Password must be at least 8 characters").matches(/\d/).withMessage("Password must contain at least one number"),
    body("confirm-password").custom((value, {req}) =>{
        return value === req.body.password;
    }).withMessage("Passwords do not match")
], async (req, res) => {
    const {username, email, password} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.render("signupPage",{
            errors:errors.array(),
            username,
            email
        });
    }



    const hashedPassword = await bcrypt.hash(password, 10)

    try{
        await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
        [username, email, hashedPassword]
    )

    } catch(error){
        if(error.code === "23505"){
            if(error.constraint === "unique_username"){
                return res.render("signupPage", {
                    errors: [
                        {
                            path:"username",
                            msg: "Username aleady exists"
                        }
                    ],
                    username,
                    email,
                })
            }

            if(error.constraint === "unique_email"){
                return res.render("signupPage", {
                    errors:[
                        {
                            path:"email",
                            msg: "Account with this email already exists"
                        }
                    ],
                    username,
                    email,
                })
            }
            
        }

        console.log(error)
        res.send("Something went wrong")
    }
    

    res.render("loginPage", {error:"Account created!"})
});
module.exports = signupRouter