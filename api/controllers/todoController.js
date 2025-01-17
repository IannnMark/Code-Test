const Todo = require("../models/todo");
const errorHandler = require("../utils/error");
const cloudinary = require("cloudinary");


exports.createTodo = async (req, res, next) => {
    try {

        let tasks = [];
        if (req.body.tasks) {
            tasks = JSON.parse(req.body.tasks);
        }

        const { title, userRef } = req.body;
        let imagesLinks = [];


        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    folder: "Todos",
                });
                imagesLinks.push({ url: result.secure_url });
            }
        }


        const newTodoList = new Todo({
            title,
            tasks,
            userRef,
            imageUrls: imagesLinks,
        });

        const todo = await newTodoList.save();
        return res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
};




exports.getTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return next(errorHandler(404, "Todo not found"));
        }
        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
}

exports.deleteTodo = async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        return next(errorHandler(404, "Todo not found"));
    }

    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json("Todo has been deleted successfully");
    } catch (error) {
        next(error);
    }
}

exports.updateTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return next(errorHandler(404, "Todo not found"));
        }


        if (req.files && req.files.length > 0) {

            if (todo.imageUrls && Array.isArray(todo.imageUrls)) {
                for (const image of todo.imageUrls) {
                    if (image.public_id) {
                        await cloudinary.uploader.destroy(image.public_id);
                    }
                }
            }


            const imagesLinks = [];
            for (const file of req.files) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    folder: "Todos",
                });
                imagesLinks.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }

            req.body.imageUrls = imagesLinks;
        } else {

            req.body.imageUrls = todo.imageUrls;
        }


        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        return res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
};
