import React, { useState } from "react";
import { getInitials } from "../../utils/helper";

export const ProfileInfo = ({ userInfo, onLogout, count }) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleToggle = () => {
    setShowInfo(!showInfo);
  };

  const formateDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Helper function to add original suffix
    function getOrdinalSuffix(day) {
      if (day > 3 && day < 21) return th;
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    }

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };

  return (
    userInfo && (
      <div className="relative flex ">
        <button
          className="px-3 py-2 text-white bg-cyan-600 rounded-full hover:bg-cyan-500"
          onClick={handleToggle}
        >
          {getInitials(userInfo ? userInfo.fullName : "")}
        </button>

        {showInfo && (
          <div className="absolute top-16 right-0 w-72 p-2 bg-slate-300 rounded shadow-lg transition-all ease-in-out">
            <h4 className="text-lg font-bold mb-2">{userInfo.fullName}</h4>
            <p className="text-sm">
              <b>Email:</b> {userInfo.email}
            </p>
            <p className="text-sm">
              <b>Stories Written:</b> {count}
            </p>
            <p className="text-sm">
              <b>Today's Date:</b> {formateDate(new Date(Date.now()))}
            </p>
          </div>
        )}

        <button onClick={onLogout} className="Btn ml-5">
          <div class="sign">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>

          <div class="text">Logout</div>
        </button>
      </div>
    )
  );
};
