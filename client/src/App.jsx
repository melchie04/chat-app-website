import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<LoginPage />} />
        <Route path="/chats" element={<HomePage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
