import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import authRoute from "./routes/auth.route.js";
import Connection from "./libs/connection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRoute from "./routes/message.route.js";
import { app,server } from "./libs/socket.js";


config();

const PORT = process.env.PORT || 8000;
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
Connection();
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/message", messageRoute);


app.get("/", async (req, res) => {
  try {
    res.status(200).send({ message: "Server Started Successfully" });
  } catch (error) {
    console.log(error);
  }
});

server.listen(PORT, () =>
  console.log(`Server Is Running On Port URL => http://localhost:${PORT}/ \n`)
);
