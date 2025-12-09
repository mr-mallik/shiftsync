/**
 * ShiftSync Schedule Configuration
 */

export const shifts = {
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

export const routines = {
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
