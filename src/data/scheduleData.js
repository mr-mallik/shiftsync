/**
 * ShiftSync Schedule Configuration - Optimized for Recovery
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
    "2025-12-25": "21-07"
};

export const routines = {
    "00-08": [
        ["21:15 – 23:15", "Commute to work (previous day)"],
        ["23:15 – 00:00", "Buffer / Prep"],
        ["00:00 – 08:00", "Warehouse Shift"],
        ["08:00 – 09:30", "Commute home + Quick shower"],
        ["09:30 – 16:00", "Sleep (extended for recovery)"],
        ["16:00 – 16:20", "Commute to gym"],
        ["16:20 – 17:40", "Workout (moderate)"],
        ["17:40 – 18:00", "Commute home"],
        ["18:00 – 18:45", "Light project work / Job applications"],
        ["18:45 – 19:30", "Dinner + Prep for next day"],
        ["19:30 – 21:15", "Optional short rest / Wind-down"]
    ],
    "22-08": [
        ["10:45 – 16:15", "Sleep (longer for recovery)"],
        ["16:15 – 16:35", "Commute to gym"],
        ["16:35 – 18:05", "Workout (moderate)"],
        ["18:05 – 18:25", "Commute home"],
        ["18:25 – 19:00", "Light project work / Job applications"],
        ["19:00 – 19:30", "Dinner + Prep"],
        ["19:30 – 20:30", "Wind-down / Relax (reading, meditation)"],
        ["20:30 – 21:00", "Commute to work"],
        ["22:00 – 08:00", "Warehouse Shift"],
        ["08:00 – 09:30", "Commute home + Quick shower / light breakfast"],
        ["09:30 – 10:45", "Wind-down / Short nap if needed"]
    ],
    "21-07": [
        ["09:45 – 16:15", "Sleep (extended)"],
        ["16:15 – 16:35", "Commute to gym"],
        ["16:35 – 18:05", "Workout (moderate, optional if low energy)"],
        ["18:05 – 18:25", "Commute home"],
        ["18:25 – 19:00", "Light project work / Job applications"],
        ["19:00 – 19:30", "Dinner"],
        ["19:30 – 20:30", "Wind-down / Reading / Meditation"],
        ["20:30 – 21:00", "Commute to work"],
        ["21:00 – 07:00", "Warehouse Shift"],
        ["07:00 – 08:00", "Commute home + Quick shower / light breakfast"]
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
