import mongoose from "mongoose";

const Connection = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(function () {
        console.log({ message: "Connected Successfully" });
      })
      .catch(function (err) {
        console.log({ message: "Failed to Connect" });
        console.log({ error: err });
      });
  } catch (error) {
    console.log(error);
  }
};

export default Connection;