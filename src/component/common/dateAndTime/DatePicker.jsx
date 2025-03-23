import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDateTimePicker = ({ value, onChange }) => {
  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={1}
      dateFormat="yyyy-MM-dd HH:mm"
      timeCaption="Time"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
    />
  );
};

export default CustomDateTimePicker;
