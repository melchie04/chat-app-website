import React, { useEffect } from "react";
import { UserState } from "../../context/UserProvider";
import { ChatState } from "../../context/ChatProvider";
import { SideBarState } from "../../context/SideBarProvider";
import { chatActions } from "../../data/action";
import { getSender } from "../../utils/chatHelper";
import { createGroupImage } from "../../utils/imageHelper";
import CircularLoader from "../customs/CircularLoader";
import { getChatList } from "../../utils/axiosHelper";

const ChatList = () => {
  const { user } = UserState();
  const {
    selectedChat,
    chatList,
    dispatch,
    isChatListLoading,
    setIsChatListLoading,
  } = ChatState();
  const { isOpen } = SideBarState();

  const fetchChatList = async () => {
    setIsChatListLoading(true);
    if (user) {
      const data = await getChatList(user);
      dispatch({ type: chatActions.GET_CHATLIST, payload: data });
    }
    setIsChatListLoading(false);
  };

  useEffect(() => {
    fetchChatList();
  }, [user]);

  const handleClick = (chat) => {
    dispatch({ type: chatActions.SELECT_CHAT, payload: chat });
  };

  return (
    <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200">
      {isChatListLoading ? (
        <div className="h-full flex justify-center items-center">
          <CircularLoader />
        </div>
      ) : (
        <div className="max-h-60">
          {chatList?.map((chat) => (
            <div
              key={chat._id}
              className={`${
                selectedChat?._id === chat._id ? "bg-gray-200" : ""
              } p-4 flex items-center hover:bg-gray-200 cursor-pointer`}
              onClick={() => handleClick(chat)}
            >
              <img
                src={
                  chat.isGroupChat
                    ? createGroupImage(chat.chatName)
                    : getSender(user, chat.users).pic
                }
                alt={chat.chatName}
                className="w-8 h-8 rounded-full mr-4 object-cover"
              />
              <div
                className={`${
                  isOpen ? "md:hidden block" : "md:block hidden"
                } flex-grow`}
              >
                <div className="font-medium">
                  {chat.isGroupChat
                    ? chat.chatName
                    : getSender(user, chat.users).name}
                </div>
                {chat.latestMessage && (
                  <div className="text-sm text-gray-400">
                    <span className="font-medium text-gray-600">
                      {chat.latestMessage.sender.name} :{" "}
                    </span>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
