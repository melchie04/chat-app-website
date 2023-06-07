import React from "react";
import { loginPageData } from "../data/content";

const LeftCover = () => {
  return (
    <div className="bg-orange-500 flex flex-col justify-center items-center text-center">
      <img src={loginPageData.logo} alt="Logo" className="w-20 h-20 p-2" />
      <h1 className="text-white text-4xl font-bold p-2">
        {loginPageData.title}
      </h1>
      <p className="text-white text-md p-2">{loginPageData.subtitle}</p>
      <img
        src={loginPageData.image}
        alt="Logo"
        className="h-auto w-[350px] max-w-full p-2"
      />
    </div>
  );
};

export default LeftCover;
