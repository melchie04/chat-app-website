import React, { useEffect, useRef, useState } from "react";
import { RiSendPlane2Fill, RiEdit2Line, RiEyeLine } from "react-icons/ri";
import axios from "axios";
import { UserState } from "../context/UserProvider";
import { ChatState } from "../context/ChatProvider";
import { SideBarState } from "../context/SideBarProvider";
import { getSender, isLastMessage, isSameSender } from "../utils/chatHelper";
import { createGroupImage } from "../utils/imageHelper";
import { chatActions } from "../data/action";
import CircularLoader from "../components/customs/CircularLoader";
import TypingLoader from "../components/customs/TypingLoader";
import { SocketState } from "../context/SocketProvider";

const ChatBox = () => {
  const messagesRef = useRef(null);
  const { user } = UserState();
  const {
    selectedChat,
    messages,
    notification,
    dispatch,
    isTyping,
    isMessagesLoading,
    setIsMessagesLoading,
  } = ChatState();
  const { socket, isSocketConnected, socketSelectedChat } = SocketState();
  const { isOpen, setIsEditModalOpen, setIsViewModalOpen } = SideBarState();
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const fetchMessages = async () => {
    setIsMessagesLoading(true);
    if (user) {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      dispatch({ type: chatActions.GET_MESSAGES, payload: data });
      socket.emit("join chat", selectedChat._id);
    }
    setIsMessagesLoading(false);
  };

  const removeNotification = () => {
    const removedNotif = notification.filter(
      (n) => n.chat._id !== selectedChat._id
    );
    dispatch({
      type: chatActions.GET_NOTIFICATION,
      payload: removedNotif,
    });
  };

  useEffect(() => {
    fetchMessages();
    removeNotification();
  }, [selectedChat]);

  const hadleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!isSocketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newMessage) {
      sendMessage();
    }
  };

  const handleClick = () => {
    if (newMessage) {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    socket.emit("stop typing", selectedChat._id);
    setNewMessage("");
    if (user) {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const sentMessage = await axios.post(
        "/api/message",
        {
          content: newMessage,
          chatId: selectedChat,
        },
        config
      );
      const newChatList = await axios.get("/api/chat", config);
      socket.emit("new message", sentMessage.data);
      dispatch({
        type: chatActions.SEND_MESSAGE,
        payload: {
          chatList: newChatList.data,
          messages: [...messages, sentMessage.data],
        },
      });
    }
  };

  return (
    <div className={`${isOpen ? "md:flex hidden" : "flex"} flex-col flex-grow`}>
      {user && selectedChat ? (
        <header className="flex justify-between items-center border-b-2 border-b-gray-200 text-gray-700 p-4 mb-4">
          <div className="flex items-center">
            <img
              src={
                selectedChat.isGroupChat
                  ? createGroupImage(selectedChat.chatName)
                  : getSender(user, selectedChat.users).pic
              }
              alt="profile"
              className="w-8 h-8 rounded-full mr-4 object-cover"
            />
            <h1 className="text-xl font-semibold">
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : getSender(user, selectedChat.users).name}
            </h1>
          </div>
          <button
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={
              selectedChat.groupAdmin?._id !== user?._id
                ? () => setIsViewModalOpen(true)
                : selectedChat.isGroupChat
                ? () => setIsEditModalOpen(true)
                : () => setIsViewModalOpen(true)
            }
          >
            {selectedChat.groupAdmin?._id !== user?._id ? (
              <RiEyeLine size={20} />
            ) : selectedChat.isGroupChat ? (
              <RiEdit2Line size={20} />
            ) : (
              <RiEyeLine size={20} />
            )}
          </button>
        </header>
      ) : null}
      {isMessagesLoading ? (
        <div className="h-full flex justify-center items-center">
          <CircularLoader />
        </div>
      ) : (
        <>
          <div
            ref={messagesRef}
            className="flex-grow h-96 rounded-md mb-4 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 relative"
          >
            {messages && user
              ? messages?.map((m, i) => (
                  <div
                    key={i}
                    className={`flex items-center mb-2 ${
                      m.sender._id === user._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <img
                      src={m.sender.pic}
                      alt={m.sender.name}
                      className={`w-5 h-5 rounded-full mr-2 object-cover ${
                        isSameSender(messages, m, i, user._id) ||
                        isLastMessage(messages, i, user._id)
                          ? "visible"
                          : "invisible"
                      }`}
                    />
                    <span
                      className={`text-sm px-4 py-2 rounded-lg ${
                        m.sender._id === user._id
                          ? "bg-blue-200"
                          : "bg-orange-200"
                      }`}
                    >
                      {m.content}
                    </span>
                  </div>
                ))
              : null}
            {isTyping ? <TypingLoader /> : null}
          </div>
          <div
            className="bg-white p-4 rounded-md "
            onKeyDown={(e) => handleKeyDown(e)}
          >
            <div className="flex">
              <input
                type="text"
                placeholder="Type your message..."
                className="bg-gray-200 rounded-full py-2 px-4 w-full focus:outline-none"
                onChange={(e) => hadleTyping(e)}
                value={newMessage}
              />
              <button className="ml-2" onClick={handleClick}>
                <RiSendPlane2Fill size={24} className="text-blue-500" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
