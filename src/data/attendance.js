// Generate 30 days of attendance for each student
const generateAttendance = () => {
  const records = {};
  const studentIds = Array.from({ length: 15 }, (_, i) => i + 1);
  
  studentIds.forEach(id => {
    const days = [];
    for (let d = 1; d <= 30; d++) {
      const date = new Date(2026, 2, d); // March 2026
      const dayOfWeek = date.getDay();
      // Weekends off
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      let present = true;
      // Some students have lower attendance
      if (id === 3) present = Math.random() > 0.35; // Rahul - poor
      else if (id === 7) present = Math.random() > 0.3; // Dev - poor
      else if (id === 9) present = Math.random() > 0.25; // Vikram - poor
      else if (id === 5) present = Math.random() > 0.15; // Arjun - moderate  
      else present = Math.random() > 0.1; // Most students good
      
      days.push({
        date: `2026-03-${String(d).padStart(2, '0')}`,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
        present
      });
    }
    records[id] = days;
  });
  
  return records;
};

const attendance = generateAttendance();

export const getAttendanceRate = (studentId) => {
  const record = attendance[studentId];
  if (!record || record.length === 0) return 0;
  const presentDays = record.filter(d => d.present).length;
  return Math.round((presentDays / record.length) * 100);
};

export const getTodayAttendance = () => {
  const today = {};
  Object.keys(attendance).forEach(id => {
    const record = attendance[id];
    const lastDay = record[record.length - 1];
    today[id] = lastDay ? lastDay.present : true;
  });
  return today;
};

export const getAttendanceStreak = (studentId) => {
  const record = attendance[studentId];
  if (!record) return 0;
  let streak = 0;
  for (let i = record.length - 1; i >= 0; i--) {
    if (record[i].present) streak++;
    else break;
  }
  return streak;
};

export const getMonthlyHeatmap = (studentId) => {
  return attendance[studentId] || [];
};

export default attendance;
