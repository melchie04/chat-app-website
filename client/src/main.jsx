import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import UserProvider from "./context/UserProvider.jsx";
import ChatProvider from "./context/ChatProvider.jsx";
import SideBarProvider from "./context/SideBarProvider.jsx";
import SocketProvider from "./context/SocketProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ChatProvider>
          <SocketProvider>
            <SideBarProvider>
              <App />
            </SideBarProvider>
          </SocketProvider>
        </ChatProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
