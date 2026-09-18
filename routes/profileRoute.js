const { Router }= require("express");
const pool = require("../db/pool")

const profileRouter = Router();
const requireAuth = (req,res,next)=>{
    if(!req.session.userId){
        return res.redirect("/login")
    }

    next();
}
profileRouter.get("/profile",requireAuth, async (req,res) =>{
    const result = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [req.session.userId]
    )

    const user = result.rows[0];

    res.render("profile", {user: user})
})

profileRouter.post("/logout", (req,res) => {
    req.session.destroy((err) => {
        if(err){
            return res.send("Could not log out")
        }

        res.redirect("/login")
    })
})

module.exports = profileRouter;