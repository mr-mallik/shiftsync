import React from 'react';
import { shifts, routines } from '../data/scheduleData';

const TimelineView = ({ selectedDate }) => {
  if (!selectedDate) {
    return null;
  }

  const shiftType = shifts[selectedDate] || "OFF";
  const routineList = routines[shiftType] || [];

  // Parse time ranges and create timeline blocks
  const parseTime = (timeStr) => {
    // Handle formats like "21:15" or "21:15 – 23:15"
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      return hours * 60 + minutes; // Convert to minutes from midnight
    }
    return 0;
  };

  const parseTimeRange = (timeLabel) => {
    // Parse "21:15 – 23:15" format
    const parts = timeLabel.split('–').map(s => s.trim());
    if (parts.length === 2) {
      const start = parseTime(parts[0]);
      let end = parseTime(parts[1]);
      
      // Handle overnight times (if end < start, add 24 hours)
      if (end < start) {
        end += 24 * 60;
      }
      
      return { start, end, startLabel: parts[0], endLabel: parts[1] };
    }
    return null;
  };

  const timelineBlocks = routineList
    .map(([time, task]) => {
      const range = parseTimeRange(time);
      return range ? { ...range, task } : null;
    })
    .filter(Boolean);

  // Calculate position and height for each block
  const getBlockStyle = (start, end) => {
    const dayMinutes = 24 * 60;
    const top = (start / dayMinutes) * 100;
    let height = ((end - start) / dayMinutes) * 100;
    
    // Handle blocks that span into next day
    if (end > dayMinutes) {
      height = ((dayMinutes - start) / dayMinutes) * 100;
    }
    
    return { top: `${top}%`, height: `${height}%` };
  };

  // Generate hour markers
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="glass-panel p-6 rounded-2xl animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        24-Hour Timeline
        <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
          shiftType === 'OFF' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
        }`}>
          {shiftType === 'OFF' ? 'Day Off' : shiftType}
        </span>
      </h3>

      <div className="relative h-[600px] sm:h-[700px]">
        {/* Hour grid */}
        <div className="absolute inset-0">
          {hours.map((hour) => (
            <div
              key={hour}
              className="absolute w-full border-t border-gray-700/30"
              style={{ top: `${(hour / 24) * 100}%` }}
            >
              <span className="absolute -top-2 text-xs text-gray-500 font-mono">
                {String(hour).padStart(2, '0')}:00
              </span>
            </div>
          ))}
        </div>

        {/* Timeline blocks */}
        <div className="absolute inset-0 ml-12">
          {timelineBlocks.map((block, index) => {
            const style = getBlockStyle(block.start, block.end);
            const isWorkShift = block.task.toLowerCase().includes('warehouse shift');
            const isSleep = block.task.toLowerCase().includes('sleep');
            const isCommute = block.task.toLowerCase().includes('commute');
            const isWorkout = block.task.toLowerCase().includes('workout') || block.task.toLowerCase().includes('gym');
            
            let bgColor = 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30';
            if (isWorkShift) bgColor = 'bg-purple-600/30 border-purple-500/60 hover:bg-purple-600/40';
            if (isSleep) bgColor = 'bg-indigo-900/40 border-indigo-500/50 hover:bg-indigo-900/50';
            if (isCommute) bgColor = 'bg-yellow-600/20 border-yellow-500/40 hover:bg-yellow-600/30';
            if (isWorkout) bgColor = 'bg-green-600/30 border-green-500/50 hover:bg-green-600/40';

            return (
              <div
                key={`${selectedDate}-timeline-${index}`}
                className={`absolute w-full border-l-4 ${bgColor} rounded-r-lg p-2 transition-all cursor-pointer group hover:z-20 hover:shadow-2xl`}
                style={{ ...style, minHeight: style.height, height: 'auto' }}
              >
                <div className="text-xs font-mono text-blue-200 mb-1 relative z-10">
                  {block.startLabel} – {block.endLabel}
                </div>
                <div className="text-sm text-gray-200 font-medium relative z-10">
                  {block.task}
                </div>
                {/* Solid background overlay on hover */}
                <div className="absolute inset-0 bg-gray-900 rounded-r-lg opacity-0 group-hover:opacity-95 transition-opacity -z-10"></div>
              </div>
            );
          })}
        </div>

        {/* Current time indicator (if viewing today) */}
        {selectedDate === new Date().toISOString().split('T')[0] && (
          <CurrentTimeIndicator />
        )}
      </div>
    </div>
  );
};

// Current time indicator component
const CurrentTimeIndicator = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const now = currentTime.getHours() * 60 + currentTime.getMinutes();
  const position = (now / (24 * 60)) * 100;

  return (
    <div
      className="absolute w-full flex items-center z-10 pointer-events-none"
      style={{ top: `${position}%` }}
    >
      <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
      <div className="flex-1 h-0.5 bg-red-500 shadow-lg shadow-red-500/30"></div>
      <span className="ml-2 text-xs text-red-400 font-mono bg-gray-900/80 px-2 py-0.5 rounded">
        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
      </span>
    </div>
  );
};

export default TimelineView;
