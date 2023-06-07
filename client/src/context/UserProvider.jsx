import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
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
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
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
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`/api/user?search=${query}`, config);
      return response.data;
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
