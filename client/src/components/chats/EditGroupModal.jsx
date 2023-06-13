import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { UserState } from "../../context/UserProvider";
import { ChatState } from "../../context/ChatProvider";
import { SideBarState } from "../../context/SideBarProvider";
import { chatActions } from "../../data/action";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../utils/toastHelper";
import CustomModal from "../customs/CustomModal";
import ModalInput from "../customs/ModalInput";
import ModalButton from "../customs/ModalButton";
import CircularLoader from "../customs/CircularLoader";
import {
  addToGroup,
  getChatList,
  getMessages,
  removeFromGroup,
  renameGroup,
} from "../../utils/axiosHelper";

const CreateGroupModal = () => {
  const { isEditModalOpen, setIsEditModalOpen } = SideBarState();
  const { user, searchUser } = UserState();
  const { selectedChat, dispatch, setIsChatListLoading } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setIsSearchLoading(true);
    setSearchValue(value);
    setShowSearchResult(Boolean(value));
    if (value) {
      const result = await searchUser(value);
      setSearchResult(result);
    }
    setIsSearchLoading(false);
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.find((s) => s._id === userToAdd._id)) {
      toastWarning("User already added!");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toastError("Only admins can add someone!");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleRemoveUser = (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toastError("Only admins can remove someone!");
      return;
    }
    if (selectedUsers.length === 3) {
      toastWarning("Group chat must have at least three members.");
      return;
    }
    setSelectedUsers(selectedUsers.filter((user) => user !== userToRemove));
  };

  const handleSubmit = async () => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toastError("Only admins can update group chat!");
      return;
    }
    setIsLoading(true);
    setIsChatListLoading(true);
    let newSelectedChat;
    let newChatList;
    let newMessages;
    const arr1 = [...selectedUsers].sort();
    const arr2 = [...selectedChat.users].sort();
    const removedUsers = arr2.filter(
      (user2) => !arr1.some((user1) => user1._id === user2._id)
    );
    const addedUsers = arr1.filter(
      (user1) => !arr2.some((user2) => user2._id === user1._id)
    );
    if (user) {
      if (removedUsers.length > 0) {
        for (const userToRemove of removedUsers) {
          newSelectedChat = await removeFromGroup(
            user,
            selectedChat,
            userToRemove
          );
        }
      }
      if (addedUsers.length > 0) {
        for (const userToAdd of addedUsers) {
          newSelectedChat = await addToGroup(user, selectedChat, userToAdd);
        }
      }
      if (groupChatName && groupChatName !== selectedChat.chatName) {
        newSelectedChat = await renameGroup(user, selectedChat, groupChatName);
      }
      newChatList = await getChatList(user);
      newMessages = await getMessages(user, selectedChat);
    }
    dispatch({
      type: chatActions.UPDATE_GROUP_CHAT,
      payload: {
        chatList: newChatList,
        messages: newMessages,
        selectedChat: newSelectedChat,
      },
    });
    clearInputs();
    setIsChatListLoading(false);
    setIsLoading(false);
    toastSuccess("Group chat has been updated!");
    setIsEditModalOpen(false);
  };

  const clearInputs = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    setSearchValue("");
    setSearchResult([]);
    setShowSearchResult(false);
  };

  useEffect(() => {
    if (selectedChat) {
      setGroupChatName(selectedChat.chatName);
      setSelectedUsers(selectedChat.users);
    }
  }, [selectedChat]);

  return (
    <CustomModal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
    >
      <div className="p-2 w-[300px]">
        <h2 className="text-xl font-semibold mb-4">Edit Group Chat</h2>
        <div className="mb-4">
          <ModalInput
            id="chatName"
            placeholder="Chat Name"
            onChange={(e) => setGroupChatName(e.target.value)}
            value={groupChatName}
          />
        </div>
        <div className="mb-4">
          <ModalInput
            id="addUsers"
            placeholder="Add Users eg: John, Rose, Max"
            onChange={handleSearch}
            value={searchValue}
          />
        </div>
        {selectedUsers.length !== 0 && (
          <div className="flex flex-wrap mb-4">
            {selectedUsers
              .filter((s) => s._id !== user._id)
              .map((user) => (
                <div
                  key={user._id}
                  className="flex items-center bg-orange-100 text-orange-500 text-sm rounded-full px-3 py-1 m-1"
                >
                  <span className="mr-1">{user.name}</span>
                  <button
                    className="text-orange-500 hover:text-orange-600"
                    onClick={() => handleRemoveUser(user)}
                  >
                    <IoClose />
                  </button>
                </div>
              ))}
          </div>
        )}
        {isSearchLoading ? (
          <div className="w-full mb-4">
            <CircularLoader />
          </div>
        ) : (
          <>
            {showSearchResult && (
              <div className="w-full mb-4 p-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200">
                {searchResult.map((user) => (
                  <div
                    key={user._id}
                    className="p-4 flex items-center hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleAddUser(user)}
                  >
                    <img
                      src={user.pic}
                      alt={user.name}
                      className="w-8 h-8 rounded-full mr-4 object-cover"
                    />
                    <div className="flex-grow">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        <div className="flex justify-center">
          <ModalButton onClick={handleSubmit} isLoading={isLoading}>
            UPDATE
          </ModalButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default CreateGroupModal;
