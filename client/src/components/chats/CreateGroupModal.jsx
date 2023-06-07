import React, { useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { UserState } from "../../context/UserProvider";
import { ChatState } from "../../context/ChatProvider";
import { SideBarState } from "../../context/SideBarProvider";
import { chatActions } from "../../data/action";
import { toastSuccess, toastWarning } from "../../utils/toastHelper";
import CustomModal from "../customs/CustomModal";
import ModalInput from "../customs/ModalInput";
import ModalButton from "../customs/ModalButton";
import CircularLoader from "../customs/CircularLoader";

const CreateGroupModal = () => {
  const { isCreateModalOpen, setIsCreateModalOpen } = SideBarState();
  const { user, searchUser } = UserState();
  const { chatList, dispatch, setIsChatListLoading } = ChatState();
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
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleRemoveUser = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter((user) => user !== userToRemove));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toastWarning("Please fill all the fields");
      return;
    }
    setIsLoading(true);
    setIsChatListLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.post(
      `/api/chat/group`,
      {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      },
      config
    );
    dispatch({
      type: chatActions.CREATE_GROUP_CHAT,
      payload: {
        chatList: [data, ...chatList],
        selectedChat: data,
      },
    });
    clearInputs();
    setIsLoading(false);
    setIsChatListLoading(false);
    toastSuccess("New group chat created!");
    setIsCreateModalOpen(false);
  };

  const clearInputs = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    setSearchValue("");
    setSearchResult([]);
    setShowSearchResult(false);
  };

  return (
    <CustomModal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
    >
      <div className="p-2 w-[300px]">
        <h2 className="text-xl font-semibold mb-4">Create Group Chat</h2>
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
            {selectedUsers.map((user) => (
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
            CREATE
          </ModalButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default CreateGroupModal;
