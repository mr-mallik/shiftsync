import React from 'react';
import { shifts, routines } from '../data/scheduleData';

const Schedule = ({ selectedDate }) => {
  if (!selectedDate) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center text-gray-500 h-full flex flex-col justify-center items-center border-dashed border-2 border-gray-700/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p>Select a date to view your routine</p>
      </div>
    );
  }

  const shiftType = shifts[selectedDate] || "OFF";
  const routineList = routines[shiftType] || [];
  
  // Check if next day has a night shift that requires pre-shift activities today
  const nextDate = new Date(selectedDate);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateStr = nextDate.toISOString().split('T')[0];
  const nextShiftType = shifts[nextDateStr];
  const preShiftRoutines = nextShiftType ? routines[`${nextShiftType}-pre`] : null;
  
  // Combine today's routines with pre-shift routines for tomorrow
  const combinedRoutines = [...routineList];
  if (preShiftRoutines) {
    combinedRoutines.push(...preShiftRoutines.map(([time, task]) => [time, `${task} (for next shift)`]));
  }

  return (
    <div key={selectedDate} className="glass-panel p-6 rounded-2xl animate-fade-in sticky top-8">
      <h2 className="text-xl font-bold mb-6 flex items-center flex-wrap gap-2">
        <span className="text-gray-400 text-lg font-normal">Schedule for</span> 
        <span className="text-white">{selectedDate}</span>
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
          shiftType === 'OFF' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
        }`}>
          {shiftType === 'OFF' ? 'Day Off' : 'Shift: ' + shiftType}
          </span>
        </h2>
        
        <div className="space-y-3">
          {combinedRoutines && combinedRoutines.map(([time, task], index) => (
            <div
              key={`${selectedDate}-${index}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between glass-card p-4 rounded-lg animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center mb-2 sm:mb-0">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  shiftType === 'OFF' ? 'bg-green-400' : 'bg-blue-400'
                }`}></div>
                <span className="font-mono text-blue-200 text-sm sm:text-base">{time}</span>
              </div>
              <span className="text-gray-300 text-sm sm:text-base text-right">{task}</span>
            </div>
          ))}
        </div>
      </div>
  );
};

export default Schedule;
