import React from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import ChatBox from "../layouts/ChatBox";
import CreateGroupModal from "../components/chats/CreateGroupModal";
import EditGroupModal from "../components/chats/EditGroupModal";
import ViewChatModal from "../components/chats/ViewChatModal";

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <ChatBox />
      </div>
      <CreateGroupModal />
      <EditGroupModal />
      <ViewChatModal />
    </div>
  );
};

export default HomePage;
