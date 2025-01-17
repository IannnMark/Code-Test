const express = require("express");
const { signUp, signIn, signOut } = require("../controllers/authController");

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/logout", signOut);





module.exports = router;