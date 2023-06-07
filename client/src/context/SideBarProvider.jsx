import React, { createContext, useContext, useState } from "react";

const SideBarContext = createContext();

const SideBarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SideBarContext.Provider
      value={{
        isOpen,
        toggle,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        isViewModalOpen,
        setIsViewModalOpen,
      }}
    >
      {children}
    </SideBarContext.Provider>
  );
};

export const SideBarState = () => {
  return useContext(SideBarContext);
};

export default SideBarProvider;
