const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
    let user = req.body;

    // hash the password
    const hash = bcrypt.hashSync(req.body.password, 8); //8 is number of iterations (2^8)

    //overwrite the password
    user.password = hash;

    Users.add(user)
        .then(saved => {
            req.session.user = user;
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.post("/login", (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            // check that the password is valid
            if (user && bcrypt.compareSync(password, user.password)) {
                // save a session
                req.session.user = user;
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(error => {
            if (error) {
                res.status(500).json({ message: "Error logging out" });
            } else {
                res.status(200).json({ message: "Logged out successfully" });
            }
        });
    } else {
        res.status(400).json({ message: "Not logged in" });
    }
});

module.exports = router;
