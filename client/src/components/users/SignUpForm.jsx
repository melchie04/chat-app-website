import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserState } from "../../context/UserProvider";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../utils/toastHelper";
import { uploadImage } from "../../utils/imageHelper";
import FormHeader from "../customs/FormHeader";
import FormLink from "../customs/FormLink";
import FormInput from "../customs/FormInput";
import FormPassword from "../customs/FormPassword";
import FormButton from "../customs/FormButton";

const SignUpForm = () => {
  const { registerUser } = UserState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePicture = async (image) => {
    setLoading(true);
    if (image === undefined) {
      toastWarning("Please select an image!");
      return;
    }
    if (image.type === "image/jpeg" || image.type === "image/png") {
      const url = await uploadImage(image);
      setPic(url);
      setLoading(false);
    } else {
      toastWarning("Please select an image!");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toastWarning("Please fill all the fields!");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toastWarning("Passwords do not match!");
      setLoading(false);
      return;
    }
    const data = await registerUser(name, email, password, pic);
    if (data) {
      toastSuccess("Account creation was successful.");
      clearInputs();
      setLoading(false);
      navigate("/chats");
    } else {
      toastError("Account creation has failed!");
      setLoading(false);
    }
  };

  const clearInputs = () => {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("uploadPhoto").value = "";
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPic("");
  };

  return (
    <form className="max-w-[400px] w-full mx-auto rounded-lg p-8 px-8">
      <FormHeader>SIGN UP</FormHeader>
      <FormLink label="Already have an account? " to="/" link="Sign In" />
      <FormInput
        id="name"
        label="Name"
        type="text"
        autoComplete="name"
        required={true}
        onChange={(e) => setName(e.target.value)}
      />
      <FormInput
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        required={true}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormPassword
        id="password"
        label="Password"
        autoComplete="create-password"
        required={true}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FormPassword
        id="confirmPassword"
        label="Confirm Password"
        autoComplete="confirm-password"
        required={true}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <FormInput
        id="uploadPhoto"
        label="Upload Your Photo"
        type="file"
        autoComplete="file"
        accept="image/*"
        onChange={(e) => handlePicture(e.target.files[0])}
      />
      <FormButton onClick={(e) => handleSubmit(e)} isLoading={loading}>
        SIGN UP
      </FormButton>
    </form>
  );
};

export default SignUpForm;
