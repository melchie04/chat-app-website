import React from "react";

const FormInput = ({
  id,
  label,
  type,
  autoComplete,
  accept,
  required,
  onChange,
}) => {
  return (
    <div className="flex flex-col py-2">
      <label className="text-sm">
        {label} {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <input
        id={id}
        className="rounded-lg bg-gray-100 focus:outline-orange-500 mt-2 p-2"
        type={type}
        autoComplete={autoComplete}
        accept={accept}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;
