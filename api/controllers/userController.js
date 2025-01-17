const errorHandler = require("../utils/error");
const Todo = require("../models/todo");


exports.getUserTodoList = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const todo = await Todo.find({ userRef: req.params.id });
            res.status(200).json(todo);
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(401, "You can only view your own TO-DO listings!"));
    }
}