import { chatActions } from "../data/action";

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case chatActions.GET_CHATLIST:
      return {
        ...state,
        chatList: payload,
        selectedChat: state.selectedChat ? state.selectedChat : payload[0],
      };
    case chatActions.SELECT_CHAT:
      return {
        ...state,
        selectedChat: payload,
      };
    case chatActions.CREATE_CHAT:
      return {
        ...state,
        chatList: payload.chatList,
        selectedChat: payload.selectedChat,
      };
    case chatActions.CREATE_GROUP_CHAT:
      return {
        ...state,
        chatList: payload.chatList,
        selectedChat: payload.selectedChat,
      };
    case chatActions.UPDATE_GROUP_CHAT:
      return {
        ...state,
        chatList: payload.chatList,
        messages: payload.messages,
        selectedChat: payload.selectedChat,
      };
    case chatActions.GET_MESSAGES:
      return {
        ...state,
        messages: payload,
      };
    case chatActions.SEND_MESSAGE:
      return {
        ...state,
        chatList: payload.chatList,
        messages: payload.messages,
      };
    case chatActions.GET_NOTIFICATION:
      return {
        ...state,
        notification: payload,
      };
    default:
      break;
  }

  return state;
};
