import React from "react";

const ModalInput = ({ id, placeholder, onChange, value }) => {
  return (
    <input
      type="text"
      name={id}
      id={id}
      placeholder={placeholder}
      className="w-full rounded-lg bg-gray-100 focus:outline-orange-500 py-2 px-4"
      onChange={onChange}
      value={value}
    />
  );
};

export default ModalInput;
