const pool = require("../db/pool");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const signup = async (req, res) => {
    const { username, email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render("signup", {
            errors: errors.array(),
            username,
            email
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
            [username, email, hashedPassword]
        );

        res.render("loginPage", {
            error: "Account created!"
        });

    } catch (error) {

        if (error.code === "23505") {

            if (error.constraint === "unique_username") {
                return res.render("signup", {
                    errors: [
                        {
                            path: "username",
                            msg: "Username already exists"
                        }
                    ],
                    username,
                    email
                });
            }

            if (error.constraint === "unique_email") {
                return res.render("signup", {
                    errors: [
                        {
                            path: "email",
                            msg: "Account with this email already exists"
                        }
                    ],
                    username,
                    email
                });
            }
        }

        console.log(error);
        res.send("Something went wrong");
    }
};

module.exports = {
    signup
};