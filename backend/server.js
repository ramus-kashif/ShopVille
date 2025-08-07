import express from "express";
import colors from "colors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import userRoutes from "./routes/userRoutes.js";
import CategoriesRoutes from "./routes/CategoriesRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import carouselRoutes from "./routes/carouselRoutes.js";
import imageSearchRoutes from "./routes/imageSearchRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ['polling', 'websocket']
});

// Export io for use in controllers
export { io };

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", CategoriesRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/carousel", carouselRoutes);
app.use("/api/v1/image-search", imageSearchRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cart", cartRoutes);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(colors.bgMagenta(`Server is Running at port ${PORT}`));
  
  io.on('connection', (socket) => {
    console.log('[Socket.IO] New client connected:', socket.id);
    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`[Socket.IO] User joined room: ${userId} (socket: ${socket.id})`);
        // List all rooms for this socket
        setTimeout(() => {
          console.log(`[Socket.IO] Rooms for socket ${socket.id}:`, Array.from(socket.rooms));
        }, 500);
      } else {
        console.log('[Socket.IO] join event received with no userId');
      }
    });
    socket.on('disconnect', () => {
      console.log('[Socket.IO] Client disconnected:', socket.id);
    });
    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });
  });
  io.engine.on('connection_error', (err) => {
    console.error('Socket.IO connection error:', err);
  });
});
