import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import authRoute from "./routes/auth.route.js";
import Connection from "./libs/connection.js";
const app = express();
config();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use("/api/v1/auth", authRoute);
Connection();

app.get("/", async (req, res) => {
  try {
    res.status(200).send({ message: "Server Started Successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () =>
  console.log(`Sever Is Running On Port URL => http://localhost:${PORT}/ \n`)
);
