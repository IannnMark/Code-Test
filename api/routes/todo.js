const express = require("express");
const upload = require("../utils/multer");
const verifyToken = require("../utils/verifyUser");

const { createTodo, getTodo, deleteTodo, updateTodo } = require("../controllers/todoController")

const router = express.Router();


router.post("/todo/new", upload.array("imageUrls"), verifyToken, createTodo);
router.get("/todo/:id", verifyToken, getTodo);
router.delete("/todo/delete/:id", verifyToken, deleteTodo);
router.put("/todo/update/:id", upload.array("imageUrls"), verifyToken, updateTodo);

module.exports = router;