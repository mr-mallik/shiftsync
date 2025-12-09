/**
 * Generate ICS file content for calendar import
 */

import { shifts, routines } from '../data/scheduleData';

// Helper function to format date for ICS
const formatICSDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

// Helper function to get event times from shift type
const getShiftTimes = (shiftType) => {
  const times = {
    "00-08": { start: "00:00", end: "08:00" },
    "22-08": { start: "22:00", end: "08:00" }, // spans midnight
    "21-07": { start: "21:00", end: "07:00" }, // spans midnight
    "OFF": null
  };
  return times[shiftType];
};

// Helper to create datetime string
const createDateTime = (dateStr, timeStr) => {
  const [hours, minutes] = timeStr.split(':');
  const date = new Date(dateStr);
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

export const generateICS = () => {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ShiftSync//Shift Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:ShiftSync Schedule',
    'X-WR-TIMEZONE:UTC',
    'X-WR-CALDESC:My rotating shift schedule from ShiftSync'
  ];

  // Generate events for each shift
  Object.entries(shifts).forEach(([dateStr, shiftType]) => {
    const shiftTimes = getShiftTimes(shiftType);
    
    if (shiftTimes) {
      const startDateTime = createDateTime(dateStr, shiftTimes.start);
      let endDate = new Date(dateStr);
      
      // If shift ends after midnight, add a day
      const startHour = parseInt(shiftTimes.start.split(':')[0]);
      const endHour = parseInt(shiftTimes.end.split(':')[0]);
      if (endHour < startHour) {
        endDate.setDate(endDate.getDate() + 1);
      }
      
      const endDateTime = createDateTime(endDate.toISOString().split('T')[0], shiftTimes.end);
      const uid = `shift-${dateStr}@shiftsync.app`;
      
      // Get routine details for description
      const routineList = routines[shiftType] || [];
      const description = routineList
        .map(([time, task]) => `${time}: ${task}`)
        .join('\\n');

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${formatICSDate(new Date().toISOString().split('T')[0])}`,
        `DTSTART:${startDateTime}`,
        `DTEND:${endDateTime}`,
        `SUMMARY:Warehouse Shift (${shiftType})`,
        `DESCRIPTION:${description}`,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'CATEGORIES:Work,Shift',
        'END:VEVENT'
      );
    } else {
      // Day off - create all-day event
      const date = new Date(dateStr);
      const startDate = dateStr.replace(/-/g, '');
      const endDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
        .replace(/-/g, '');
      const uid = `dayoff-${dateStr}@shiftsync.app`;
      
      const routineList = routines["OFF"] || [];
      const description = routineList
        .map(([time, task]) => `${time}: ${task}`)
        .join('\\n');

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${formatICSDate(new Date().toISOString().split('T')[0])}`,
        `DTSTART;VALUE=DATE:${startDate}`,
        `DTEND;VALUE=DATE:${endDate}`,
        'SUMMARY:Day Off',
        `DESCRIPTION:${description}`,
        'STATUS:CONFIRMED',
        'TRANSP:TRANSPARENT',
        'CATEGORIES:Personal,Day Off',
        'END:VEVENT'
      );
    }
  });

  icsContent.push('END:VCALENDAR');
  
  return icsContent.join('\r\n');
};

export const downloadICS = () => {
  const icsContent = generateICS();
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'shiftsync-schedule.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};
