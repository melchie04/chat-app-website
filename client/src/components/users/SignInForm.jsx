import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserState } from "../../context/UserProvider";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../utils/toastHelper";
import FormHeader from "../customs/FormHeader";
import FormLink from "../customs/FormLink";
import FormInput from "../customs/FormInput";
import FormPassword from "../customs/FormPassword";
import FormButton from "../customs/FormButton";

const SignInForm = () => {
  const { loginUser } = UserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toastWarning("Please fill all the fields!");
      setLoading(false);
      return;
    }
    const data = await loginUser(email, password);
    if (data) {
      toastSuccess("Login successfully!");
      clearInputs();
      setLoading(false);
      navigate("/chats");
    } else {
      toastError("Invalid user or password!");
      setLoading(false);
    }
  };

  const handleGuest = (e) => {
    e.preventDefault();
    setEmail("guest@gmail.com");
    setPassword("guest");
  };

  useEffect(() => {
    document.getElementById("email").value = email;
    document.getElementById("password").value = password;
  }, [email, password]);

  const clearInputs = () => {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    setEmail("");
    setPassword("");
  };

  return (
    <form className="max-w-[400px] w-full mx-auto rounded-lg p-8 px-8">
      <FormHeader>SIGN IN</FormHeader>
      <FormLink label="New here? " to="/register" link="Create an Account" />
      <FormInput
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormPassword
        id="password"
        label="Password"
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <FormButton onClick={(e) => handleSubmit(e)} isLoading={loading}>
        SIGN IN
      </FormButton>
      <button
        className="w-full py-2 bg-red-500 shadow-lg text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
        onClick={(e) => handleGuest(e)}
      >
        GUEST
      </button>
    </form>
  );
};

export default SignInForm;
