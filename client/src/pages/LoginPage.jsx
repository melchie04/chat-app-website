import React from "react";
import { Route, Routes } from "react-router-dom";
import LeftCover from "../layouts/LeftCover";
import SignInForm from "../components/users/SignInForm";
import SignUpForm from "../components/users/SignUpForm";

const LoginPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <LeftCover />
      <div className="flex flex-col justify-center items-center">
        <Routes>
          <Route path="*" element={<SignInForm />} />
          <Route path="/register" element={<SignUpForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default LoginPage;
