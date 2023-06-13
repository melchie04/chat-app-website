import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiLogOut } from "react-icons/fi";
import { UserState } from "../context/UserProvider";
import { ChatState } from "../context/ChatProvider";
import { chatPageData } from "../data/content";
import { getSender } from "../utils/chatHelper";
import { chatActions } from "../data/action";
import { SocketState } from "../context/SocketProvider";

const Header = () => {
  const { user, logoutUser } = UserState();
  const { notification, dispatch } = ChatState();
  const { socket } = SocketState();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const profileDropDownRef = useRef(null);
  const notifDropDownRef = useRef(null);
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifDropdown(false);
  };

  const toggleNotifDropdown = () => {
    setShowNotifDropdown(!showNotifDropdown);
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    dispatch({
      type: chatActions.CLEAR,
      payload: null,
    });
    socket.off("setup");
    logoutUser();
    navigate("/");
  };

  const handleClickOutside = (event) => {
    if (
      profileDropDownRef.current &&
      !profileDropDownRef.current.contains(event.target)
    ) {
      setShowProfileDropdown(false);
    }
    if (
      notifDropDownRef.current &&
      !notifDropDownRef.current.contains(event.target)
    ) {
      setShowNotifDropdown(false);
    }
  };

  const handleNotif = (notif) => {
    const removedNotif = notification.filter((n) => n !== notif);
    dispatch({
      type: chatActions.GET_NOTIFICATION,
      payload: removedNotif,
    });
    dispatch({ type: chatActions.SELECT_CHAT, payload: notif.chat });
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between bg-orange-500 p-4">
      <div className="flex items-center">
        <img src={chatPageData.logo} alt="Logo" className="w-10 pr-2" />
        <h1 className="text-white md:text-3xl sm:text-2xl text-xl font-bold">
          {chatPageData.title}
        </h1>
      </div>
      <div className="flex items-center">
        <div
          ref={notifDropDownRef}
          className="text-white hover:bg-orange-400 text-xl rounded-full p-[6px] sm:mr-4 mr-2 cursor-pointer relative"
          onClick={toggleNotifDropdown}
        >
          <FiBell />
          {notification.length > 0 && (
            <div className="absolute top-1 right-1 -mt-1 -mr-1 flex items-center justify-center w-4 h-4 bg-red-500 rounded-full text-xs text-white">
              {notification.length}
            </div>
          )}
          {showNotifDropdown && (
            <div className="w-80 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 absolute right-0 mt-2 p-2 bg-white rounded-md shadow-md z-50">
              <hr />
              {notification.length === 0 && (
                <>
                  <p className="whitespace-nowrap text-left py-2 px-4 text-black text-sm my-2">
                    No New Messages
                  </p>
                  <hr />
                </>
              )}
              {notification.map((notif) => (
                <div key={notif._id}>
                  <button
                    className="flex items-center w-full text-left text-black text-sm py-2 px-4 hover:bg-gray-100 my-2"
                    onClick={() => handleNotif(notif)}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${
                          getSender(user, notif.chat.users).name
                        }`}
                  </button>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
        <div ref={profileDropDownRef} className="relative">
          <img
            src={user?.pic}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer object-cover"
            onClick={toggleProfileDropdown}
          />
          {showProfileDropdown && (
            <div className="w-80 absolute right-0 mt-2 p-2 bg-white rounded-md shadow-md overflow-hidden z-50">
              <div className="flex items-center p-4">
                <img
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                  src={user?.pic}
                  alt="Profile"
                />
                <p className="whitespace-nowrap text-left">{user?.name}</p>
              </div>
              <hr className="mb-2" />
              <button
                className="flex items-center w-full text-sm text-left py-2 px-4 hover:bg-gray-100"
                onClick={handleLogout}
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
