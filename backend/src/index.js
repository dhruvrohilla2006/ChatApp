import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import authRoute from "./routes/auth.route.js";
import Connection from "./libs/connection.js";
import cookieParser from "cookie-parser";
import path from "path";
import messageRoute from "./routes/message.route.js";
const app = express();
config();

const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(cookieParser());

// Define the uploads directory
const UPLOAD_DIR = path.join(process.cwd(), "src", "uploads");

// Serve static files from the uploads directory
app.use("/uploads", express.static(UPLOAD_DIR));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/message", messageRoute);
Connection();

app.get("/", async (req, res) => {
  try {
    res.status(200).send({ message: "Server Started Successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () =>
  console.log(`Server Is Running On Port URL => http://localhost:${PORT}/ \n`)
);
