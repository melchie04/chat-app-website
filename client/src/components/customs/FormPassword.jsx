import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

const FormPassword = ({ id, label, autoComplete, required, onChange }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };

  return (
    <div className="flex flex-col py-2">
      <label className="text-sm">
        {label} {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <div className="relative">
        <input
          id={id}
          className="rounded-lg bg-gray-100 focus:outline-orange-500 mt-2 p-2 w-full"
          type={open === false ? "password" : "text"}
          autoComplete={autoComplete}
          onChange={onChange}
        />
        <div className="text-xl text-gray-400 cursor-pointer absolute top-[1.15rem] right-4">
          {open === false ? (
            <AiFillEye onClick={toggle} />
          ) : (
            <AiFillEyeInvisible onClick={toggle} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPassword;
