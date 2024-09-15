const express = require("express");
const userController = require("../controllers/user");

const { verify} = require("../auth");

const router = express.Router();

router.get("/logout", (req, res) => {

    req.session.destroy((error) => {
        if (err){
            console.log("Error while destroying session:", err);
        } else {

         
            req.logout(() => {
                console.log("Your are logged out");
                res.redirect("/");

            });

        }

    });
});



router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

module.exports = router;