// components/CustomTimePicker.js
import React, { useState } from 'react';
import './TimePickerBook.css'

const CustomTimePicker = ({ onChange,style }: any) => {
  const [selectedTime, setSelectedTime] = useState('08:00');

  const generateTimeList = (startHour: number, endHour: number, intervalMinutes: number) => {
    const timeList = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const period = hour < 12 ? 'AM' : 'PM';
        timeList.push(`${formattedHour}:${formattedMinute} ${period}`);
      }
    }
    return timeList;
  };

  const timeList = generateTimeList(8, 18, 15); // Tạo danh sách giờ từ 8:00 AM đến 6:00 PM, cách nhau 15 phút

  const handleTimeChange = (event: any) => {
    const newTime = event.target.value;
    setSelectedTime(newTime);
    if (onChange) {
      onChange(newTime);
    }
  };

  return (
    <div >
      <select value={selectedTime} onChange={handleTimeChange} className='timepicker' style={style}>
        {timeList.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomTimePicker;
