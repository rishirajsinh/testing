const aiInsights = {
  classInsights: [
    { id: 1, type: 'warning', icon: '💡', title: 'CLASS INSIGHT', text: '68% of students scored below 50 in Algebra section', action: 'Schedule a revision session this week', actionLabel: 'Schedule Now' },
    { id: 2, type: 'info', icon: '📅', title: 'TIMING INSIGHT', text: 'Assessments on Mondays yield 23% lower average scores', action: 'Move tests to Wednesday or Thursday', actionLabel: 'Apply' },
    { id: 3, type: 'success', icon: '🎯', title: 'ENGAGEMENT INSIGHT', text: 'Participation dropped 40% in last 2 weeks', action: 'Try gamified quiz activities', actionLabel: 'Get Lesson Ideas' },
    { id: 4, type: 'warning', icon: '📊', title: 'PERFORMANCE ALERT', text: 'Class 10B average dropped 12% compared to last month', action: 'Review teaching methodology for weak topics', actionLabel: 'View Details' },
    { id: 5, type: 'info', icon: '🔍', title: 'PATTERN DETECTED', text: 'Students who attend Friday sessions score 18% higher', action: 'Prioritize critical topics on Fridays', actionLabel: 'Adjust Schedule' },
  ],
  
  attendancePatterns: [
    '📊 Mondays show 34% attendance drop — likely weekend lag effect',
    '🔔 Rahul K. has missed 8 consecutive Fridays — possible recurring issue',
    '📉 Class attendance average dropped 12% this month vs last month',
    '⚠️ 6 students have attendance below 75% — parent alerts recommended',
    '📅 Wednesday has highest attendance at 96% — optimal day for tests',
  ],

  schoolInsights: [
    { text: 'Class 10B has lowest average (58%) — needs intervention', type: 'danger' },
    { text: 'Mathematics is hardest subject (42% below passing)', type: 'warning' },
    { text: 'Attendance drops 25% in exam weeks — scheduling issue?', type: 'info' },
    { text: "Teacher Dr. Sharma's class shows 35% grade improvement", type: 'success' },
    { text: 'Computer Science has highest pass rate at 89%', type: 'success' },
  ],

  motivationalMessages: [
    "You're close! Just 8 more marks in Math to move from C to B grade. You can do it! 💪",
    "Your Science scores have been consistently improving. Keep up the great work! 🌟",
    "You're in the top 20% for English — incredible job this term! 📚",
    "A little extra effort in Physics numericals could boost your overall percentage by 5%! 🚀",
  ],

  studyPlanTemplate: {
    morning: { time: '9:00 AM - 11:00 AM', icon: '📘', label: 'Morning Focus' },
    afternoon: { time: '2:00 PM - 4:00 PM', icon: '🔬', label: 'Afternoon Practice' },
    evening: { time: '6:00 PM - 7:00 PM', icon: '📖', label: 'Evening Review' },
  },
};

export default aiInsights;
