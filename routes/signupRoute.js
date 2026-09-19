const { Router } = require("express");
const { body } = require("express-validator");
const signupController = require("../controllers/signupController");

const signupRouter = Router();

signupRouter.get("/signup", (req, res) => {
    res.render("signupPage", {
        errors: null,
        username: "",
        email: ""
    });
});

signupRouter.post(
    "/signup",
    [
        body("username")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characters"),

        body("email")
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email"),

        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters")
            .matches(/\d/)
            .withMessage("Password must contain at least one number"),

        body("confirm-password")
            .custom((value, { req }) => {
                return value === req.body.password;
            })
            .withMessage("Passwords do not match")
    ],
    signupController.signup
);

module.exports = signupRouter;