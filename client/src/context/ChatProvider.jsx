import React, { createContext, useContext, useReducer, useState } from "react";
import { reducer } from "../reducer/chatReducer";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isChatListLoading, setIsChatListLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const initialState = {
    chatList: [],
    selectedChat: null,
    notification: [],
    messages: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        dispatch,
        isTyping,
        setIsTyping,
        isChatListLoading,
        setIsChatListLoading,
        isMessagesLoading,
        setIsMessagesLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
