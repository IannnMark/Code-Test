const express = require("express");

const { getUserTodoList } = require("../controllers/userController");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/todo/:id", verifyToken, getUserTodoList);

module.exports = router;