import User from "../modals/User.modal.js";
import Message from "../modals/message.modal.js";

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
        { senderId: myId, reciverId: UserToChatId },
        { reciverId: UserToChatId, senderId: myId },
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
    const { text } = req.body;
    const senderId = req.user._id;
    const reciverId = UserToChatId;
    let fileUrl;
    if (!req.file.filename) {
      fileUrl = "";
    } else {
      fileUrl = `/uploads/${req.file.filename}`;
    }
    const newMessage = new Message({
      senderId,
      reciverId,
      text,
      fileUrl,
    });
    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage", error.message);
    res.status(500).json({ message: "Server Internal Error" });
  }
};
