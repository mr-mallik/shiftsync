import React, { useState } from 'react';
import { shifts } from '../data/scheduleData';

const Calendar = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    onDateSelect(dateStr);
  };

  const renderEmptySlots = () => {
    return Array.from({ length: firstDay }, (_, i) => (
      <div key={`empty-${i}`}></div>
    ));
  };

  const renderDays = () => {
    const dayElements = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isWorkDay = shifts[dateStr];
      const isSelected = selectedDate === dateStr;

      dayElements.push(
        <div
          key={day}
          onClick={() => handleDayClick(dateStr)}
          className={`
            calendar-day p-4 text-center rounded-xl cursor-pointer glass-card relative overflow-hidden group
            ${isWorkDay ? 'border-blue-500/30' : 'border-white/5'}
            ${isSelected ? 'active ring-2 ring-blue-500' : ''}
          `}
          data-date={dateStr}
        >
          <span className={`relative z-10 font-medium ${isWorkDay ? 'text-blue-200' : 'text-gray-300'}`}>
            {day}
          </span>
          {isWorkDay && (
            <>
              <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors"></div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
            </>
          )}
        </div>
      );
    }
    
    return dayElements;
  };

  return (
    <section className="lg:col-span-7">
      <div className="glass-panel p-6 rounded-2xl">
        <div className="mb-4">
          <h2 className="text-2xl font-light text-white/80">{`${monthNames[month]} ${year}`}</h2>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {/* Week Headers */}
          {days.map((d) => (
            <div key={d} className="text-center font-bold text-gray-400 text-sm uppercase tracking-wider py-2">
              {d}
            </div>
          ))}
          {/* Empty Slots */}
          {renderEmptySlots()}
          {/* Days */}
          {renderDays()}
        </div>
      </div>
    </section>
  );
};

export default Calendar;
