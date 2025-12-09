import React, { useState } from 'react';
import Calendar from './components/Calendar';
import Schedule from './components/Schedule';
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
