import React, { useState } from "react";
import { ProfileInfo } from "./Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userInfo, count }) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // nor of stories
  
  return (
    <>
      <nav className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
        <div className="flex items-center flex-shrink-0">
          <h1 className="journal py-2 px-2 ml-2 text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 block bg-clip-text text-transparent w-max">
            My Journal
          </h1>
        </div>
        <div className="flex items-center flex-shrink-0 mx-6">
          {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} count={count}/>}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
