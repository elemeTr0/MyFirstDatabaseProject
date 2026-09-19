


const profile = (req,res) => {
    req.session.destroy((err) => {
        if(err){
            return res.send("Could not log out")
        }

        res.redirect("/login")
    })
}

module.exports = profile