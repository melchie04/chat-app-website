import React, { useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { UserState } from "../../context/UserProvider";
import { ChatState } from "../../context/ChatProvider";
import { SideBarState } from "../../context/SideBarProvider";
import { chatActions } from "../../data/action";
import CircularLoader from "../customs/CircularLoader";

const SearchBox = () => {
  const { isOpen } = SideBarState();
  const { user, searchUser } = UserState();
  const { chatList, dispatch, setIsChatListLoading } = ChatState();
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setIsLoading(true);
    setSearchValue(value);
    setShowDropdown(Boolean(value));
    if (value) {
      const result = await searchUser(value);
      setSearchResult(result);
    }
    setIsLoading(false);
  };

  const handleClick = async (userId) => {
    if (user) {
      setSearchResult([]);
      setSearchValue("");
      setShowDropdown(false);
      setIsChatListLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chatList.find((c) => c._id === data._id)) {
        dispatch({
          type: chatActions.CREATE_CHAT,
          payload: {
            chatList: [data, ...chatList],
            selectedChat: data,
          },
        });
      } else {
        dispatch({ type: chatActions.SELECT_CHAT, payload: data });
      }
    }
    setIsChatListLoading(false);
  };

  return (
    <div
      className={`${
        isOpen ? "md:hidden block" : "md:block hidden"
      } flex-grow relative`}
    >
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md pl-10 pr-4 py-2"
        onChange={handleSearch}
        value={searchValue}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <FaSearch className="text-gray-400" />
      </div>
      {showDropdown && (
        <div className="absolute mt-1 w-full p-2 bg-white shadow-lg rounded-bl rounded-br max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200">
          {isLoading ? (
            <CircularLoader />
          ) : (
            <>
              {searchResult.map((user) => (
                <div
                  key={user._id}
                  className="p-4 flex items-center hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleClick(user._id)}
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
