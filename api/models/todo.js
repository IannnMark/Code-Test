const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: [true, "Task description is required"],
        },
    },
    { timestamps: true }
);

const todoListSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Todo title is required"],
        },
        tasks: [taskSchema],
        imageUrls: {
            type: Array,
            required: true,
        },
        userRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },

    { timestamps: true }
);

module.exports = mongoose.model("Todos", todoListSchema);
