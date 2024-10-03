import React from "react";
import { MdOutlineDateRange, MdClose } from "react-icons/md";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import moment from "moment";
import { useState } from "react";

const DateSelector = ({ date, setDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false)
  return (
    <div>
      <button
        className="inline-flex items-center text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1 cursor-pointer"
        onClick={() => {
          setOpenDatePicker(true);
        }}
      >
        <MdOutlineDateRange className="text-lg" />
        {date
          ? moment(date).format("Do MM YYYY")
          : moment().format("Do MM YYYY")}
      </button>

      {openDatePicker && (<div className="overflow-y-scroll p-5 bg-sky-50/80 rounded-lg relative pt-9">
          <button className="flex items-center justify-center w-8 h-8 absolute top-2 right-2  bg-sky-100 hover:bg-rose-100 rounded-full" onClick={() => {
            setOpenDatePicker(false);
          }}>
            <MdClose className="text-xl text-sky-600 rounded-full hover:text-rose-600 bg-sky-100 hover:bg-rose-100"/>
          </button>
          <DayPicker 
            captionLayout="dropdown-buttons"
            mode="single"
            selected={date}
            onSelect={setDate}
            pagedNavigation
          />
      </div>)}
    </div>
  );
};

export default DateSelector;
