import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getUser, verifyUser } from "../utils/axiosHelper";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const data = await verifyUser(email, password);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const registerUser = async (name, email, password, pic) => {
    try {
      const data = await createUser(name, email, password, pic);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  const searchUser = async (query) => {
    try {
      const data = await getUser(user, query);
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("userInfo"));
    setUser(loggedUser);
    if (loggedUser) {
      navigate("/chats");
    } else {
      if (window.location.pathname !== "/register") {
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <UserContext.Provider
      value={{ user, loginUser, registerUser, logoutUser, searchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserState = () => {
  return useContext(UserContext);
};

export default UserProvider;
