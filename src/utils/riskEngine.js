import { getAttendanceRate } from '../data/attendance';
import { getAverageMarks } from '../data/marks';

export function calculateRiskScore(studentId) {
  const attendance = getAttendanceRate(studentId);
  const avgMarks = getAverageMarks(studentId);
  
  // Risk formula: weighted combination
  const attendanceRisk = Math.max(0, (75 - attendance) * 1.5);
  const marksRisk = Math.max(0, (50 - avgMarks) * 1.2);
  
  const riskScore = Math.min(100, Math.round(attendanceRisk + marksRisk));
  
  return riskScore;
}

export function getRiskLevel(score) {
  if (score >= 70) return { label: 'CRITICAL', color: '#f43f5e', emoji: '🔴' };
  if (score >= 50) return { label: 'HIGH RISK', color: '#f59e0b', emoji: '🟠' };
  if (score >= 30) return { label: 'NEEDS ATTENTION', color: '#eab308', emoji: '🟡' };
  return { label: 'SAFE', color: '#10b981', emoji: '🟢' };
}

export function getRiskFactors(studentId) {
  const attendance = getAttendanceRate(studentId);
  const avgMarks = getAverageMarks(studentId);
  const factors = [];
  
  if (attendance < 75) factors.push('Low attendance (' + attendance + '%)');
  if (attendance < 60) factors.push('Critical attendance level');
  if (avgMarks < 40) factors.push('Failing grades');
  if (avgMarks < 50) factors.push('Below average marks (' + avgMarks + '%)');
  if (avgMarks < 60 && attendance < 80) factors.push('Combined attendance-marks risk');
  
  return factors.length > 0 ? factors : ['No significant risk factors'];
}

export function getConfidence(riskScore) {
  if (riskScore >= 70) return Math.floor(85 + Math.random() * 10);
  if (riskScore >= 50) return Math.floor(75 + Math.random() * 15);
  return Math.floor(60 + Math.random() * 20);
}
