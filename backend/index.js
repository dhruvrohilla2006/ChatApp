import express from "express";
const app = express();
import { config } from "dotenv";
import bodyParser from "body-parser";
config();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    res.status(200).send({ message: "Server Started Successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () =>
  console.log(`Sever Is Running On Port URL => http://localhost:${PORT}/ `)
);
