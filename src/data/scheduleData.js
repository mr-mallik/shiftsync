/**
 * ShiftSync Schedule Configuration
 * Note: Pre-shift activities for night shifts occur on the PREVIOUS day
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
    // Midnight shift (00:00-08:00) - Activities on shift day
    "00-08": [
        ["00:00 – 08:00", "Warehouse Shift"],
        ["08:00 – 09:30", "Commute home"],
        ["09:30 – 10:00", "Breakfast and shower"],
        ["10:00 – 16:00", "Sleep"],
        ["16:00 – 16:20", "Commute to gym"],
        ["16:20 – 17:40", "Workout"],
        ["17:40 – 18:00", "Commute home"],
        ["18:00 – 18:45", "Projects"],
        ["18:45 – 19:30", "Dinner"],
        ["19:30 – 21:15", "Wind down"]
    ],
    
    // Pre-shift activities for 00-08 shift (occurs on previous day)
    "00-08-pre": [
        ["21:15 – 23:00", "Commute to work"],
        ["23:00 – 23:59", "Prep"]
    ],
    
    // Night shift (22:00-08:00) - Activities on shift day
    "22-08": [
        ["08:00 – 09:30", "Commute home"],
        ["09:30 – 10:00", "Breakfast and shower"],
        ["10:00 – 16:15", "Sleep"],
        ["16:15 – 16:35", "Commute to gym"],
        ["16:35 – 18:05", "Workout"],
        ["18:05 – 18:25", "Commute home"],
        ["18:25 – 19:00", "Projects"],
        ["19:00 – 19:30", "Dinner"],
        ["19:30 – 20:30", "Wind down"]
    ],
    
    // Pre-shift activities for 22-08 shift (occurs on previous day)
    "22-08-pre": [
        ["20:30 – 21:00", "Commute to work"],
        ["21:00 – 22:00", "Prep"],
        ["22:00 – 23:59", "Warehouse Shift"]
    ],
    
    // Evening shift (21:00-07:00) - Activities on shift day
    "21-07": [
        ["07:00 – 08:30", "Commute home"],
        ["08:30 – 09:00", "Breakfast and shower"],
        ["09:00 – 15:30", "Sleep"],
        ["15:30 – 15:50", "Commute to gym"],
        ["15:50 – 17:20", "Workout"],
        ["17:20 – 17:40", "Commute home"],
        ["17:40 – 18:30", "Projects"],
        ["18:30 – 19:00", "Dinner"],
        ["19:00 – 20:00", "Wind down"]
    ],
    
    // Pre-shift activities for 21-07 shift (occurs on previous day)
    "21-07-pre": [
        ["20:00 – 20:30", "Commute to work"],
        ["20:30 – 21:00", "Prep"],
        ["21:00 – 23:59", "Warehouse Shift"]
    ],
    
    // Day off routine
    "OFF": [
        ["09:00 – 10:00", "Wake up and breakfast"],
        ["10:00 – 12:30", "Projects"],
        ["12:30 – 13:00", "Lunch"],
        ["13:00 – 14:30", "Commute to gym"],
        ["14:30 – 15:30", "Workout"],
        ["15:30 – 16:00", "Commute home"],
        ["16:00 – 18:00", "Projects"],
        ["18:00 – 19:00", "Dinner"],
        ["19:00 – 22:00", "Relax"],
        ["22:00 – 23:00", "Prep for next day"]
    ]
};
