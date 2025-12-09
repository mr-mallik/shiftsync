/**
 * ShiftSync Application Logic
 * Consolidates configuration and calendar logic.
 */

// ==========================================
// CONFIGURATION
// ==========================================

const shifts = {
    "2025-12-12": "00-08",
    "2025-12-13": "00-08",
    "2025-12-14": "22-08",
    "2025-12-15": "22-08",
    "2025-12-18": "22-08",
    "2025-12-19": "22-08",
    "2025-12-21": "22-08",
    "2025-12-22": "22-08",
    "2025-12-24": "21-07",
    "2025-12-25": "21-07",
};

const routines = {
    "00-08": [
        ["21:15 – 23:15", "Commute to work (previous day for next 00:00 shift)"],
        ["23:15 – 00:00", "Buffer / Prep"],
        ["00:00 – 08:00", "Warehouse Shift"],
        ["08:00 – 09:45", "Commute home"],
        ["09:45 – 10:45", "Eat + Shower"],
        ["10:45 – 16:45", "Sleep"],
        ["16:45 – 17:05", "Commute to gym"],
        ["17:05 – 18:35", "Workout"],
        ["18:35 – 18:55", "Commute home"],
        ["19:00 – 20:00", "Job applications / Side projects"],
        ["20:00 – 21:00", "Dinner + Prep"]
    ],
    "22-08": [
        ["10:45 – 17:00", "Sleep"],
        ["17:00 – 17:20", "Commute to gym"],
        ["17:20 – 18:50", "Workout"],
        ["18:50 – 19:10", "Commute home"],
        ["19:10 – 20:30", "Job applications / Projects"],
        ["20:30 – 21:00", "Dinner + Prep"],
        ["21:00 – 22:00", "Commute to work"],
        ["22:00 – 08:00", "Warehouse Shift"],
        ["08:00 – 09:45", "Commute home"],
        ["09:45 – 10:45", "Wind down"]
    ],
    "21-07": [
        ["09:45 – 16:00", "Sleep"],
        ["16:00 – 16:20", "Commute to gym"],
        ["16:20 – 17:50", "Workout"],
        ["17:50 – 18:10", "Commute home"],
        ["18:10 – 19:30", "Applications / Projects"],
        ["19:30 – 20:00", "Dinner"],
        ["20:00 – 21:00", "Commute to work"],
        ["21:00 – 07:00", "Warehouse Shift"],
        ["07:00 – 08:45", "Commute home"]
    ],
    "OFF": [
        ["09:00 – 10:00", "Wake up + Breakfast"],
        ["10:00 – 12:30", "Job applications / Side projects"],
        ["12:30 – 13:00", "Lunch"],
        ["13:00 – 15:00", "Gym + Commute"],
        ["15:00 – 15:30", "Commute home + Shower"],
        ["15:30 – 18:00", "Continue projects / Job search"],
        ["18:00 – 19:00", "Dinner"],
        ["19:00 – 22:00", "Relax / Light coding / Reading"],
        ["22:00 – 23:00", "Prep for next day / Sleep buffer"]
    ]
};

// ==========================================
// APP LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
    const scheduleEl = document.getElementById('schedule');
    const scheduleTitleEl = document.getElementById('schedule-title');
    const scheduleBodyEl = document.getElementById('schedule-body');
    const currentMonthEl = document.getElementById('current-month');

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Set Month Title
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    if (currentMonthEl) currentMonthEl.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Render Week Headers
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach(d => {
        const header = document.createElement('div');
        header.className = "text-center font-bold text-gray-400 text-sm uppercase tracking-wider py-2";
        header.textContent = d;
        calendarEl.appendChild(header);
    });

    // Render Empty Slots
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        calendarEl.appendChild(empty);
    }

    // Render Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const isWorkDay = shifts[dateStr];

        const dayEl = document.createElement('div');
        dayEl.className = `
            calendar-day p-4 text-center rounded-xl cursor-pointer glass-card relative overflow-hidden group
            ${isWorkDay ? 'border-blue-500/30' : 'border-white/5'}
        `;
        dayEl.dataset.date = dateStr;

        // Content
        dayEl.innerHTML = `
            <span class="relative z-10 font-medium ${isWorkDay ? 'text-blue-200' : 'text-gray-300'}">${day}</span>
            ${isWorkDay ? `<div class="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors"></div>` : ''}
            ${isWorkDay ? `<div class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>` : ''}
        `;

        dayEl.addEventListener('click', () => showSchedule(dateStr));
        calendarEl.appendChild(dayEl);
    }

    function showSchedule(date) {
        const shiftType = shifts[date] || "OFF";

        // Update Title
        scheduleTitleEl.innerHTML = `
            <span class="text-gray-400 text-lg font-normal">Schedule for</span> 
            <span class="text-white">${date}</span>
            <span class="ml-2 px-2 py-0.5 text-xs rounded-full ${shiftType === 'OFF' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}">
                ${shiftType === 'OFF' ? 'Day Off' : 'Shift: ' + shiftType}
            </span>
        `;

        // Clear and Populate Body
        scheduleBodyEl.innerHTML = '';

        const routineList = routines[shiftType];
        if (routineList) {
            routineList.forEach(([time, task], index) => {
                const row = document.createElement('div');
                row.className = "flex flex-col sm:flex-row sm:items-center justify-between glass-card p-4 rounded-lg animate-fade-in";
                row.style.animationDelay = `${index * 50}ms`;

                row.innerHTML = `
                    <div class="flex items-center mb-2 sm:mb-0">
                        <div class="w-2 h-2 rounded-full mr-3 ${shiftType === 'OFF' ? 'bg-green-400' : 'bg-blue-400'}"></div>
                        <span class="font-mono text-blue-200 text-sm sm:text-base">${time}</span>
                    </div>
                    <span class="text-gray-300 text-sm sm:text-base text-right">${task}</span>
                `;
                scheduleBodyEl.appendChild(row);
            });
        }

        // Show Schedule Section
        scheduleEl.classList.remove('hidden');
        scheduleEl.classList.add('animate-fade-in');

        // Scroll to schedule on mobile
        if (window.innerWidth < 768) {
            scheduleEl.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
