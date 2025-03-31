import User from "../modals/User.modal.js";
import Message from "../modals/message.modal.js";
import { getReciverSocketId, io } from "../libs/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedUser = req.user;

    const filterredUser = await User.find({ _id: { $ne: loggedUser } }).select(
      "-password"
    );

    res.send(filterredUser);
  } catch (error) {
    console.log("Error Found in getUserForSidebar", error.message);
    res.status(500).json({ message: "Server Internal Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: UserToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { reciverId: UserToChatId, senderId: myId },
        { senderId: UserToChatId, reciverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages", error.message);
    res.status(500).json({ message: "Server Internal Error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { id: UserToChatId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;
    const reciverId = UserToChatId;
    let fileUrl;
    if (!req.imageUrl) {
      fileUrl = "";
      const newMessage = new Message({
        senderId,
        reciverId,
        text: message,
        image: fileUrl,
      });

      await newMessage.save();
     
      const reciverSocketId = await getReciverSocketId(reciverId);
      if (reciverSocketId) {
        io.to(reciverSocketId).emit("newMessage", newMessage);
      }

      res.status(200).json(newMessage);
    } else {
      fileUrl = req.imageUrl;
      const newMessage = new Message({
        senderId,
        reciverId,
        text: message,
        image: fileUrl,
      });

      await newMessage.save();
      const reciverSocketId = await getReciverSocketId(reciverId);
      if (reciverSocketId) {
       
        io.to(reciverSocketId).emit("newMessage", newMessage);
      }

      res.status(200).json(newMessage);
    }
  } catch (error) {
    console.log("Error in sendMessage", error.message);
    res.status(500).json({ message: "Server Internal Error" });
  }
};
