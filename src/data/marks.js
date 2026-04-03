const marks = {
  subjects: ['Mathematics', 'Science', 'English', 'History', 'Computer Science'],
  // Per student: { subjectName: [test1, test2, test3, test4] }
  1:  { Mathematics: [78, 82, 85, 88], Science: [85, 88, 90, 92], English: [72, 75, 78, 80], History: [88, 85, 82, 86], 'Computer Science': [92, 95, 94, 96] },
  2:  { Mathematics: [41, 38, 35, 42], Science: [89, 91, 88, 90], English: [84, 82, 86, 85], History: [75, 78, 80, 77], 'Computer Science': [70, 72, 75, 73] },
  3:  { Mathematics: [32, 28, 25, 30], Science: [45, 42, 38, 40], English: [55, 52, 48, 50], History: [60, 58, 55, 57], 'Computer Science': [35, 30, 28, 32] },
  4:  { Mathematics: [88, 90, 92, 95], Science: [92, 94, 96, 95], English: [90, 88, 92, 91], History: [85, 88, 90, 87], 'Computer Science': [94, 96, 98, 97] },
  5:  { Mathematics: [55, 50, 48, 52], Science: [62, 58, 55, 60], English: [68, 65, 62, 66], History: [70, 68, 72, 69], 'Computer Science': [58, 55, 52, 56] },
  6:  { Mathematics: [85, 88, 90, 87], Science: [78, 80, 82, 81], English: [92, 90, 94, 93], History: [88, 90, 92, 89], 'Computer Science': [82, 85, 88, 86] },
  7:  { Mathematics: [28, 25, 22, 26], Science: [35, 32, 30, 33], English: [42, 40, 38, 41], History: [38, 35, 32, 36], 'Computer Science': [45, 42, 40, 43] },
  8:  { Mathematics: [72, 75, 78, 76], Science: [80, 82, 85, 83], English: [85, 88, 90, 87], History: [78, 80, 82, 79], 'Computer Science': [88, 90, 92, 91] },
  9:  { Mathematics: [35, 30, 28, 32], Science: [40, 38, 35, 37], English: [45, 42, 40, 43], History: [50, 48, 45, 47], 'Computer Science': [38, 35, 32, 36] },
  10: { Mathematics: [90, 92, 95, 93], Science: [88, 90, 92, 91], English: [82, 85, 88, 86], History: [92, 94, 96, 95], 'Computer Science': [90, 92, 94, 93] },
  11: { Mathematics: [68, 70, 72, 71], Science: [72, 75, 78, 76], English: [65, 68, 70, 67], History: [70, 72, 75, 73], 'Computer Science': [75, 78, 80, 77] },
  12: { Mathematics: [82, 85, 88, 86], Science: [85, 88, 90, 87], English: [78, 80, 82, 81], History: [80, 82, 85, 83], 'Computer Science': [88, 90, 92, 90] },
  13: { Mathematics: [45, 42, 40, 43], Science: [50, 48, 45, 47], English: [55, 52, 50, 53], History: [48, 45, 42, 46], 'Computer Science': [52, 50, 48, 51] },
  14: { Mathematics: [75, 78, 80, 77], Science: [82, 85, 88, 86], English: [88, 90, 92, 91], History: [85, 88, 90, 87], 'Computer Science': [80, 82, 85, 83] },
  15: { Mathematics: [60, 58, 55, 57], Science: [65, 62, 60, 63], English: [70, 68, 65, 67], History: [58, 55, 52, 55], 'Computer Science': [62, 60, 58, 61] },
};

export const getLatestMarks = (studentId) => {
  const studentMarks = marks[studentId];
  if (!studentMarks) return {};
  const latest = {};
  Object.keys(studentMarks).forEach(subject => {
    const scores = studentMarks[subject];
    latest[subject] = scores[scores.length - 1];
  });
  return latest;
};

export const getAverageMarks = (studentId) => {
  const latest = getLatestMarks(studentId);
  const values = Object.values(latest);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
};

export const getGrade = (marks) => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 40) return 'D';
  return 'F';
};

export const getSubjectTrend = (studentId, subject) => {
  const studentMarks = marks[studentId];
  if (!studentMarks || !studentMarks[subject]) return [];
  return studentMarks[subject].map((score, i) => ({
    test: `Test ${i + 1}`,
    score
  }));
};

export const getClassAverage = (subject) => {
  let total = 0;
  let count = 0;
  Object.keys(marks).forEach(id => {
    if (id === 'subjects') return;
    const studentMarks = marks[id];
    if (studentMarks && studentMarks[subject]) {
      const scores = studentMarks[subject];
      total += scores[scores.length - 1];
      count++;
    }
  });
  return count > 0 ? Math.round(total / count) : 0;
};

export default marks;
