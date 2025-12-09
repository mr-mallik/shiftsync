import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import Schedule from './components/Schedule';
import TimelineView from './components/TimelineView';
import { downloadICS } from './utils/icsGenerator';
import './App.css';

function App() {
  // Set default to today's date
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'timeline'

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
          
          <section className="lg:col-span-5 space-y-6">
            {/* View Toggle */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  List
                </span>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Timeline
                </span>
              </button>
            </div>

            {/* Content Views */}
            {viewMode === 'list' ? (
              <Schedule selectedDate={selectedDate} />
            ) : (
              <TimelineView selectedDate={selectedDate} />
            )}
          </section>
        </main>
        
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>&copy; 2025 ShiftSync. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
