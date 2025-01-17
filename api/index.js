const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoRoutes = require("./routes/todo");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const cloudinary = require("cloudinary");
const cookieParser = require("cookie-parser");


dotenv.config();

mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB");
})
    .catch(err => {
        console.log(err);
    });


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(cookieParser());


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.use("/api/todo", todoRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});