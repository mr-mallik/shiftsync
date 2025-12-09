import React, { useState } from 'react';
import Calendar from './components/Calendar';
import Schedule from './components/Schedule';
import { downloadICS } from './utils/icsGenerator';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    // Scroll to schedule on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const scheduleEl = document.querySelector('.lg\\:col-span-5');
        if (scheduleEl) {
          scheduleEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleExportCalendar = () => {
    downloadICS();
  };

  return (
    <div className="text-gray-100 min-h-screen p-4 sm:p-8 selection:bg-blue-500 selection:text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              ShiftSync
            </h1>
            <p className="text-gray-400 text-sm md:text-base">Master your rotating schedule</p>
          </div>
          <button
            onClick={handleExportCalendar}
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors glass-card"
            title="Export to Google Calendar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Export to Calendar
          </button>
        </header>

        {/* Main Content */}
        <main className="grid lg:grid-cols-12 gap-8">
          <Calendar onDateSelect={handleDateSelect} />
          <Schedule selectedDate={selectedDate} />
        </main>
        
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>&copy; 2025 ShiftSync. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
