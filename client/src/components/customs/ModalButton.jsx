import React from "react";

const ModalButton = ({ children, onClick, isLoading }) => {
  return (
    <button
      className="w-full py-2 bg-[#169CF9] shadow-lg text-white font-semibold rounded-lg hover:bg-[#0E7DD7] transition-colors duration-300"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default ModalButton;
