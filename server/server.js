import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/user-auth.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const frontendUrl= ["http://localhost:5173"]

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:frontendUrl ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//api endpoint
app.get("/", (req, res) => {
  res.send("API Working");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON syntax. Please correct your request body.",
    });
  }
  next(err); // Pass other errors down
});

app.listen(port, () => {
  console.log(`Server Started on Port: ${port}`);
});
