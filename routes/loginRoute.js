const { Router } = require("express");
const loginController = require("../controllers/loginController");

const loginRouter = Router();

loginRouter.get("/login", (req, res) => {
    res.render("loginPage", {
        error: null
    });
});

loginRouter.post("/login", loginController.login);

module.exports = loginRouter;