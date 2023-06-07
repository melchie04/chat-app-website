import React from "react";
import CustomModal from "../customs/CustomModal";
import { UserState } from "../../context/UserProvider";
import { ChatState } from "../../context/ChatProvider";
import { SideBarState } from "../../context/SideBarProvider";
import { getSender } from "../../utils/chatHelper";
import { createGroupImage } from "../../utils/imageHelper";

const ViewChatModal = () => {
  const { user } = UserState();
  const { selectedChat } = ChatState();
  const { isViewModalOpen, setIsViewModalOpen } = SideBarState();

  return (
    <CustomModal
      isOpen={isViewModalOpen}
      onClose={() => setIsViewModalOpen(false)}
    >
      {user && selectedChat ? (
        <div className="flex flex-col items-center text-center p-4">
          <img
            src={
              selectedChat.isGroupChat
                ? createGroupImage(selectedChat.chatName)
                : getSender(user, selectedChat.users).pic
            }
            alt="User Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover"
          />
          <h1 className="text-xl font-bold">
            {selectedChat.isGroupChat
              ? selectedChat.chatName
              : getSender(user, selectedChat.users).name}
          </h1>
        </div>
      ) : null}
    </CustomModal>
  );
};

export default ViewChatModal;
