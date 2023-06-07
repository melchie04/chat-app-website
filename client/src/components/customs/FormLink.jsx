import React from "react";
import { Link } from "react-router-dom";

const FormLink = ({ label, to, link }) => {
  return (
    <p className="text-sm text-center pt-2 pb-4">
      <span className="text-gray-400">{label}</span>
      <Link
        to={to}
        className="text-[#169CF9] hover:text-[#0E7DD7] transition-colors duration-300 cursor-pointer"
      >
        {link}
      </Link>
    </p>
  );
};

export default FormLink;
