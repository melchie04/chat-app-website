import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { ChatState } from "./ChatProvider";
import { UserState } from "./UserProvider";
import { chatActions } from "../data/action";
import { getChatList } from "../utils/axiosHelper";

const SocketContext = createContext();
const ENDPOINT = import.meta.env.VITE_DEPLOYED_URL;
var socket, socketSelectedChat;

const SocketProvider = ({ children }) => {
  const { user } = UserState();
  const { selectedChat, notification, messages, dispatch, setIsTyping } =
    ChatState();
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    if (user) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setIsSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }
  }, [user]);

  useEffect(() => {
    socketSelectedChat = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (user && socketSelectedChat) {
      socket.on("message received", (newMessageReceived) => {
        if (socketSelectedChat._id === newMessageReceived.chat._id) {
          dispatch({
            type: chatActions.GET_MESSAGES,
            payload: [...messages, newMessageReceived],
          });
        } else {
          if (!notification.includes(newMessageReceived)) {
            dispatch({
              type: chatActions.GET_NOTIFICATION,
              payload: [newMessageReceived, ...notification],
            });
          }
        }
        fetchChatList();
      });
    }
  });

  const fetchChatList = async () => {
    if (user) {
      const data = await getChatList(user);
      dispatch({ type: chatActions.GET_CHATLIST, payload: data });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isSocketConnected,
        setIsSocketConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const SocketState = () => {
  return useContext(SocketContext);
};

export default SocketProvider;
