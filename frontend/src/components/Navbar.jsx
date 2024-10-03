import React, { useState } from "react";
import { ProfileInfo } from "./Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./Input/SearchBar";

const Navbar = ({ userInfo, count, searchQuery, setSearchQuery,onSearchNote, handleClearSearch }) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = (e) => {
    if(searchQuery){
      onSearchNote(searchQuery)
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("")
  };

  return (
    <>
      <nav className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
        <div className="flex items-center flex-shrink-0">
          <h1 className="journal py-2 px-2 ml-2 text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 block bg-clip-text text-transparent w-max">
            My Journal
          </h1>
        </div>
        <div className="flex items-center flex-shrink-0 mx-6">
          {isToken && (
            <>
              <div className="w-full max-w-lg">
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  handleSearch={handleSearch}
                  onClearSearch={onClearSearch}
                />
              </div>
              <div className="ml-6">
                <ProfileInfo
                  userInfo={userInfo}
                  onLogout={onLogout}
                  count={count}
                />
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
