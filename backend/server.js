import express from "express";
import colors from "colors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

//MongoDB connection

connectDB();

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow only this origin
  })
);
app.use(cookieParser());
// importing routes

import userRoutes from "./routes/userRoutes.js";
import CategoriesRoutes from "./routes/CategoriesRoutes.js";

// http://localhost:8080/
// http://localhost:8080/api/v1/users

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", CategoriesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(colors.bgMagenta(`Server is Running at port ${PORT} `));
});
