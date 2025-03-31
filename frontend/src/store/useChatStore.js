import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../libs/Axios.js";
import { useAuthStore } from "./useAuthStore.js";
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isSendingMessage: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/user");
      set({ users: await res.data });
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);

      set({ messages: await res.data });
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();
    set({ isSendingMessage: true });
   

    toast.loading("Message is Sending");

    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log("THis is Catch Error => \t", error.response.data);
      toast.dismiss();
      toast.error("Message Sending Failed");
    } finally {
      set({ isSendingMessage: false });
      toast.dismiss();
      toast.success("Message Sent");
    }
  },

  subscribeToMessages: async () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

 

    const socket = useAuthStore.getState().socket;
  
    socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
    if (!isMessageSentFromSelectedUser) return;
      const premessages = get().messages
      set({
        messages: [...premessages, newMessage],
      });
    });
  },

  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
   
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
