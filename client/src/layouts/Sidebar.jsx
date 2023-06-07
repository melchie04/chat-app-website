import React from "react";
import { FaPlus } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { SideBarState } from "../context/SideBarProvider";
import SearchBox from "../components/chats/SearchBox";
import ChatList from "../components/chats/ChatList";

const Sidebar = () => {
  const { isOpen, toggle, setIsCreateModalOpen } = SideBarState();

  return (
    <div
      className={`${
        isOpen ? "md:w-20 w-screen" : "md:w-1/3 w-20"
      } flex flex-col border-r-2 border-r-gray-200 transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 flex items-center">
        <SearchBox />
        <button
          className="text-gray-400 text-xl ml-2 hover:bg-gray-200 rounded-md p-1"
          onClick={toggle}
        >
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>
      <ChatList />
      <button
        className="p-4 bg-[#169CF9] hover:bg-[#0E7DD7] text-white text-sm font-medium flex items-center justify-center"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <FaPlus className="text-white mr-2" />
        <span className={isOpen ? "md:hidden block" : "md:block hidden"}>
          New Group Chat
        </span>
      </button>
    </div>
  );
};

export default Sidebar;
