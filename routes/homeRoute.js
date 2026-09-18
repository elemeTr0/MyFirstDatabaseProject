const { Router } = require("express")

const homeRouter = Router()

homeRouter.get("/", (req, res) => {
    res.render("home", {
        userId: req.session.userId
    })
})


module.exports = homeRouter;