import axios from "axios";

const deployedUrl = import.meta.env.VITE_DEPLOYED_URL;

export const verifyUser = async (email, password) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const { data } = await axios.post(
    `${deployedUrl}/api/user/login`,
    { email, password },
    config
  );
  return data;
};

export const createUser = async (name, email, password, pic) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const { data } = await axios.post(
    `${deployedUrl}/api/user`,
    {
      name,
      email,
      password,
      pic,
    },
    config
  );
  return data;
};

export const getUser = async (user, query) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { data } = await axios.get(
    `${deployedUrl}/api/user?search=${query}`,
    config
  );
  return data;
};

export const getChatList = async (user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { data } = await axios.get(`${deployedUrl}/api/chat`, config);
  return data;
};

export const createChat = async (user, userId) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { data } = await axios.post(
    `${deployedUrl}/api/chat`,
    { userId },
    config
  );
  return data;
};

export const createGroup = async (user, groupChatName, selectedUsers) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { data } = await axios.post(
    `${deployedUrl}/api/chat/group`,
    {
      name: groupChatName,
      users: JSON.stringify(selectedUsers.map((u) => u._id)),
    },
    config
  );
  return data;
};

export const removeFromGroup = async (user, selectedChat, userToRemove) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { data } = await axios.put(
    `${deployedUrl}/api/chat/groupremove`,
    {
      chatId: selectedChat._id,
      userId: userToRemove._id,
    },
    config
  );
  return data;
};

export const addToGroup = async (user, selectedChat, userToAdd) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { data } = await axios.put(
    `${deployedUrl}/api/chat/groupadd`,
    {
      chatId: selectedChat._id,
      userId: userToAdd._id,
    },
    config
  );
  return data;
};

export const renameGroup = async (user, selectedChat, groupChatName) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { data } = await axios.put(
    `${deployedUrl}/api/chat/grouprename`,
    {
      chatId: selectedChat._id,
      chatName: groupChatName,
    },
    config
  );
  return data;
};

export const getMessages = async (user, selectedChat) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { data } = await axios.get(
    `${deployedUrl}/api/message/${selectedChat._id}`,
    config
  );
  return data;
};

export const createMessage = async (user, newMessage, selectedChat) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { data } = await axios.post(
    `${deployedUrl}/api/message`,
    {
      content: newMessage,
      chatId: selectedChat,
    },
    config
  );
  return data;
};
