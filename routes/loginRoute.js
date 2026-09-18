const { Router } = require("express");
const pool = require("../db/pool")
const bcrypt = require("bcrypt");

const loginRouter = Router();

loginRouter.get("/login", (req, res) => {
    res.render("loginPage", {error:null})
});

loginRouter.post("/login", async (req,res)=>{
    const {username, password} = req.body
    const result = await pool.query(
        "SELECT * FROM users WHERE username = $1 OR email = $1",
        [username]
    )
    if(result.rows.length === 0){
        return res.send("Users not found");
    }

    const user = result.rows[0]

    const passwordMatch = await bcrypt.compare(password, user.password)

    if(!passwordMatch){
        return res.render("loginPage", {error:"Incorrect username or password"});
    }

    req.session.userId = user.id;

    res.redirect("/profile");
})

module.exports = loginRouter;