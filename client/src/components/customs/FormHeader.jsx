import React from "react";

const FormHeader = ({ children }) => {
  return (
    <h2 className="text-3xl font-semibold text-orange-500 text-center py-2">
      {children}
    </h2>
  );
};

export default FormHeader;
