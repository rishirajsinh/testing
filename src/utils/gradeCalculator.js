export function getGrade(marks) {
  if (marks >= 90) return { grade: 'A+', color: '#10b981', label: 'Outstanding' };
  if (marks >= 80) return { grade: 'A', color: '#22c55e', label: 'Excellent' };
  if (marks >= 70) return { grade: 'B+', color: '#06b6d4', label: 'Very Good' };
  if (marks >= 60) return { grade: 'B', color: '#3b82f6', label: 'Good' };
  if (marks >= 50) return { grade: 'C', color: '#f59e0b', label: 'Average' };
  if (marks >= 40) return { grade: 'D', color: '#f97316', label: 'Below Average' };
  return { grade: 'F', color: '#f43f5e', label: 'Fail' };
}

export function getGPA(percentage) {
  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.7;
  if (percentage >= 70) return 3.3;
  if (percentage >= 60) return 3.0;
  if (percentage >= 50) return 2.5;
  if (percentage >= 40) return 2.0;
  return 0.0;
}

export function getPercentile(studentAvg, allAverages) {
  const sorted = [...allAverages].sort((a, b) => a - b);
  const index = sorted.indexOf(studentAvg);
  return Math.round((index / sorted.length) * 100);
}

export function calculateClassRank(studentId, allStudentIds, getAvg) {
  const averages = allStudentIds.map(id => ({ id, avg: getAvg(id) }));
  averages.sort((a, b) => b.avg - a.avg);
  const rank = averages.findIndex(s => s.id === studentId) + 1;
  return rank;
}
