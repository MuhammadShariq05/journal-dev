import React from "react";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      {/* Image with cyan background */}
        <div className="w-32 h-32 bg-amber-300/50 flex items-center justify-center rounded-full">
          <img
            src={imgSrc}
            alt="No Notes"
            className="w-20 h-20 object-cover text-cyan-400"
          />
      </div>

      {/* Description */}
      <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5 px-7">
        {message ||
          "Start creating your first Journal! Click the 'Add' button to jot down your thoughts, ideas, and memories."}
      </p>

      {/* Highlighted call to action */}
      {!message && (
        <span className="font-extrabold text-4xl py-7 mt-7 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-300">
          Let’s get started!!
        </span>
      )}
    </div>
  );
};

export default EmptyCard;
