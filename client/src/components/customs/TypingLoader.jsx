import React from "react";

const TypingLoader = () => {
  return (
    <div className="flex items-center mb-2 justify-start absolute bottom-0 left-5">
      <div className="flex justify-center items-center space-x-2">
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDuration: "0.5s", animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDuration: "0.5s", animationDelay: "0.3s" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDuration: "0.5s", animationDelay: "0.6s" }}
        ></div>
      </div>
    </div>
  );
};

export default TypingLoader;
