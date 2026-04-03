import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getLatestMarks, getAverageMarks, getGrade, getSubjectTrend } from '../../data/marks';
import marks from '../../data/marks';
import { getAttendanceRate, getMonthlyHeatmap } from '../../data/attendance';
import { calculateRiskScore, getRiskLevel } from '../../utils/riskEngine';
import { getGPA } from '../../utils/gradeCalculator';
import StatCard from '../../components/ui/StatCard';
import GradientButton from '../../components/ui/GradientButton';
import RadarChartComponent from '../../components/charts/RadarChart';
import PerformanceChart from '../../components/charts/PerformanceChart';
import HeatmapCalendar from '../../components/charts/HeatmapCalendar';
import StudyPlanCard from '../../components/ai/StudyPlanCard';
import PredictionWidget from '../../components/ai/PredictionWidget';
import RiskMeter from '../../components/ui/RiskMeter';
import useAI from '../../hooks/useAI';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { success } = useNotification();
  const studentId = user?.studentId || 1;
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => location.hash.replace('#', '') || 'overview');
  
  useEffect(() => {
    setActiveSection(location.hash.replace('#', '') || 'overview');
  }, [location.hash]);

  const handleTabChange = (tab) => {
    setActiveSection(tab);
    navigate(`#${tab}`, { replace: true });
  };

  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const { generateResponse, loading: aiLoading } = useAI();
  const [reportText, setReportText] = useState('');
  const reportRef = useRef(null);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      success('Generating PDF...');
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0a0f2e',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${user?.name || 'Student'}_Report_Card.pdf`);
      success('Report downloaded successfully! 📄');
    } catch (err) {
      console.error(err);
    }
  };

  const latestMarks = getLatestMarks(studentId);
  const avgMarks = getAverageMarks(studentId);
  const attendance = getAttendanceRate(studentId);
  const riskScore = calculateRiskScore(studentId);
  const riskLevel = getRiskLevel(riskScore);
  const gpa = getGPA(avgMarks);
  const predicted = Math.round(avgMarks * 1.05);

  // Calculate rank (simplified)
  const allAvgs = Array.from({ length: 15 }, (_, i) => getAverageMarks(i + 1));
  const sortedAvgs = [...allAvgs].sort((a, b) => b - a);
  const rank = sortedAvgs.indexOf(avgMarks) + 1;

  // Radar data
  const radarData = marks.subjects.map(s => ({
    subject: s.length > 8 ? s.slice(0, 8) + '.' : s,
    score: latestMarks[s] || 0,
    classAvg: Math.round(allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length),
  }));

  // Performance trend
  const trendData = marks.subjects.length > 0 ? (marks[studentId]?.[marks.subjects[0]] || []).map((_, i) => ({
    name: `Test ${i + 1}`,
    score: Math.round(marks.subjects.reduce((sum, s) => sum + (marks[studentId]?.[s]?.[i] || 0), 0) / marks.subjects.length),
  })) : [];

  // Subjects progress
  const subjectProgress = marks.subjects.map(s => ({
    name: s,
    score: latestMarks[s] || 0,
    grade: getGrade(latestMarks[s] || 0),
  }));

  // Pomodoro timer
  useState(() => {
    if (!pomodoroActive) return;
    const interval = setInterval(() => {
      setPomodoroTime(t => {
        if (t <= 0) { setPomodoroActive(false); return 25 * 60; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  });

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // Badges
  const badges = [
    { icon: '🏆', name: 'Perfect Attendance', earned: attendance >= 95, desc: 'Maintain 95%+ attendance' },
    { icon: '⭐', name: 'Top Scorer', earned: rank <= 3, desc: 'Top 3 in class' },
    { icon: '📈', name: 'Most Improved', earned: trendData.length > 1 && trendData[trendData.length - 1]?.score > trendData[0]?.score, desc: 'Show consistent improvement' },
    { icon: '🔥', name: '7-Day Streak', earned: true, desc: '7 consecutive study days' },
    { icon: '🎯', name: 'Subject Master', earned: Object.values(latestMarks).some(v => v >= 90), desc: 'Score 90+ in any subject' },
    { icon: '💎', name: 'Scholar', earned: avgMarks >= 80, desc: 'Average above 80%' },
  ];

  const xp = Math.round(avgMarks * 10 + attendance * 5 + (100 - riskScore) * 3);
  const level = Math.floor(xp / 500) + 1;
  const xpProgress = (xp % 500) / 500 * 100;

  const sectionStyle = {
    padding: '24px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '24px',
  };

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon="📋" value={attendance} suffix="%" label="Attendance This Term" color="var(--cyan)" delay={0} />
        <StatCard icon="📝" value={avgMarks} suffix="%" label="Average Marks" color="var(--primary)" delay={1} />
        <StatCard icon="🔮" value={predicted} label="AI Predicted Score" color="var(--ai-glow)" delay={2} />
        <StatCard icon="🏆" value={`#${rank}`} label="Class Rank" color="var(--emerald)" delay={3} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['overview', 'study-plan', 'report-card', 'wellness', 'achievements'].map(tab => (
          <button key={tab} onClick={() => handleTabChange(tab)} style={{
            padding: '8px 18px', borderRadius: 'var(--radius-full)',
            background: activeSection === tab ? 'linear-gradient(135deg, var(--cyan), var(--emerald))' : 'var(--bg-card)',
            border: activeSection === tab ? 'none' : '1px solid var(--border-default)',
            color: activeSection === tab ? 'white' : 'var(--text-secondary)',
            fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize',
            transition: 'all 0.3s var(--spring)',
          }}>{tab.replace('-', ' ')}</button>
        ))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {activeSection === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <RadarChartComponent data={radarData} title="🎯 Subject Strength Analysis" />
            <PerformanceChart data={trendData} title="📈 Marks Trend Over Assessments" />
          </div>

          {/* Subject Progress */}
          <div style={sectionStyle}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px' }}>
              📚 Subject-wise Progress
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subjectProgress.map(s => {
                const gradeInfo = getGradeInfo(s.score);
                return (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, width: '140px', color: 'var(--text-secondary)' }}>{s.name}</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--bg-deep)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${gradeInfo.color}, ${gradeInfo.color}aa)`,
                        width: `${s.score}%`, transition: 'width 1s var(--smooth)',
                        boxShadow: `0 0 10px ${gradeInfo.color}40`,
                      }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, width: '48px', textAlign: 'right', color: gradeInfo.color }}>{s.score}%</span>
                    <span style={{
                      padding: '3px 8px', borderRadius: 'var(--radius-full)',
                      background: `${gradeInfo.color}15`, color: gradeInfo.color,
                      fontSize: '0.7rem', fontWeight: 700, width: '32px', textAlign: 'center',
                    }}>{gradeInfo.grade}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <PredictionWidget student={{ name: user?.name || 'Student' }} marks={latestMarks} />
        </>
      )}

      {/* ═══ STUDY PLAN ═══ */}
      {activeSection === 'study-plan' && (
        <>
          <StudyPlanCard />

          {/* Study Streak Heatmap */}
          <div style={{ marginTop: '24px' }}>
            <HeatmapCalendar data={getMonthlyHeatmap(studentId)} title="📅 Study Streak Calendar" />
          </div>

          {/* Pomodoro Timer */}
          <div style={{
            ...sectionStyle,
            marginTop: '24px',
            textAlign: 'center',
          }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '20px' }}>
              ⏱️ Focus Timer (Pomodoro)
            </h4>
            <div style={{
              width: 160, height: 160, borderRadius: '50%',
              background: 'var(--bg-deep)',
              border: `3px solid ${pomodoroActive ? 'var(--emerald)' : 'var(--border-default)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              transition: 'border-color 0.3s',
              boxShadow: pomodoroActive ? '0 0 30px rgba(16,185,129,0.3)' : 'none',
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700,
                color: pomodoroActive ? 'var(--emerald)' : 'var(--text-primary)',
              }}>{formatTime(pomodoroTime)}</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <GradientButton
                variant={pomodoroActive ? 'danger' : 'cyan'}
                onClick={() => {
                  setPomodoroActive(!pomodoroActive);
                  if (!pomodoroActive) {
                    // Start timer
                    const interval = setInterval(() => {
                      setPomodoroTime(t => {
                        if (t <= 1) {
                          clearInterval(interval);
                          setPomodoroActive(false);
                          success('🎉 Focus session complete!');
                          return 25 * 60;
                        }
                        return t - 1;
                      });
                    }, 1000);
                  }
                }}
              >
                {pomodoroActive ? '⏸ Pause' : '▶ Start Focus'}
              </GradientButton>
              <GradientButton variant="ghost" onClick={() => { setPomodoroTime(25 * 60); setPomodoroActive(false); }}>
                🔄 Reset
              </GradientButton>
            </div>
          </div>
        </>
      )}

      {/* ═══ REPORT CARD ═══ */}
      {activeSection === 'report-card' && (
        <>
          <div ref={reportRef} style={{
            ...sectionStyle,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(6,182,212,0.05))',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
            {/* Report Card Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: '2px solid var(--border-default)' }}>
              <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Academic Session 2025-2026</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
                📄 Digital Report Card
              </h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {user?.name || 'Aarav Mehta'} — Class {user?.class || '10A'} — Roll No: {user?.rollNo || 'STU001'}
              </div>
            </div>

            {/* Subjects Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default)' }}>
                  {['Subject', 'Marks', 'Grade', 'AI Comment'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {marks.subjects.map(subject => {
                  const score = latestMarks[subject] || 0;
                  const gradeInfo = getGradeInfo(score);
                  const comments = {
                    'Mathematics': score >= 70 ? 'Excellent analytical skills' : 'Needs to focus on problem solving',
                    'Science': score >= 70 ? 'Strong conceptual understanding' : 'More lab practice recommended',
                    'English': score >= 70 ? 'Good communication skills' : 'Reading comprehension needs work',
                    'History': score >= 70 ? 'Well-researched and articulate' : 'Should focus on key events',
                    'Computer Science': score >= 70 ? 'Outstanding logical thinking' : 'Practice more coding problems',
                  };
                  return (
                    <tr key={subject} style={{ borderBottom: '1px solid var(--border-default)' }}>
                      <td style={{ padding: '14px 16px', fontSize: '0.9rem', fontWeight: 500 }}>{subject}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: gradeInfo.color }}>{score}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/100</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: 'var(--radius-full)',
                          background: `${gradeInfo.color}15`, color: gradeInfo.color,
                          fontSize: '0.8rem', fontWeight: 700,
                        }}>{gradeInfo.grade}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        {comments[subject] || 'Good performance'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center', padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-deep)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Overall %</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>{avgMarks}%</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-deep)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>GPA</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--cyan)' }}>{gpa.toFixed(1)}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-deep)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Class Rank</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--emerald)' }}>#{rank}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-deep)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Attendance</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: attendance > 75 ? 'var(--emerald)' : 'var(--danger)' }}>{attendance}%</div>
              </div>
            </div>

            {/* AI Summary */}
            <div style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(167,139,250,0.05)',
              border: '1px solid rgba(167,139,250,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span>🤖</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ai-glow)' }}>AI Summary</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {avgMarks >= 70
                  ? `You are performing above class average in ${marks.subjects.filter(s => (latestMarks[s] || 0) >= 70).length} subjects. Great consistency! Focus on maintaining your strengths while improving weaker areas.`
                  : `You need to focus more on ${marks.subjects.filter(s => (latestMarks[s] || 0) < 50).join(' and ')}. With targeted study sessions, you can improve your overall average by 15-20%.`
                }
              </p>
            </div>

            {/* Download */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <GradientButton onClick={downloadPDF}>
                📥 Download Real Report Card (PDF)
              </GradientButton>
            </div>
          </div>

          {/* AI Generated Report */}
          {reportText && (
            <div style={{
              ...sectionStyle,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.83rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              animation: 'aiGlow 3s ease-in-out infinite',
              border: '1px solid rgba(167,139,250,0.3)',
            }}>
              {reportText}
            </div>
          )}
        </>
      )}

      {/* ═══ WELLNESS ═══ */}
      {activeSection === 'wellness' && (
        <div style={sectionStyle}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, marginBottom: '24px' }}>
            ❤️ Academic Health & Wellness
          </h4>

          {/* Health Score */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <RiskMeter score={100 - riskScore} size={180} />
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600 }}>
                Academic Health Score
              </span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {riskScore < 30 ? '🟢 You\'re doing great!' : riskScore < 60 ? '🟡 Some areas need attention' : '🔴 Immediate action needed'}
              </div>
            </div>
          </div>

          {/* Risk Flags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {attendance < 85 && (
              <div style={{
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                fontSize: '0.85rem', color: 'var(--warning)',
              }}>
                📅 Attendance is at {attendance}% — try not to miss more classes
              </div>
            )}
            {Object.entries(latestMarks).filter(([, v]) => v < 50).map(([subject, score]) => (
              <div key={subject} style={{
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
                fontSize: '0.85rem', color: 'var(--danger)',
              }}>
                ⚠️ {subject} marks dropped to {score}/100 — needs immediate focus
              </div>
            ))}
            {riskScore < 30 && (
              <div style={{
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                fontSize: '0.85rem', color: 'var(--emerald)',
              }}>
                ✅ No major risk flags — keep up the excellent work!
              </div>
            )}
          </div>

          {/* Motivational Message */}
          <div style={{
            padding: '20px', borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))',
            border: '1px solid rgba(99,102,241,0.2)',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}>💪</span>
            <p style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6 }}>
              {avgMarks >= 70
                ? "You're doing amazing! Keep pushing and you'll ace the finals!"
                : `You're close! Just ${50 - Math.min(...Object.values(latestMarks))} more marks in ${marks.subjects.find(s => latestMarks[s] === Math.min(...Object.values(latestMarks)))} to pass. You can do it!`
              }
            </p>
          </div>
        </div>
      )}

      {/* ═══ ACHIEVEMENTS ═══ */}
      {activeSection === 'achievements' && (
        <>
          {/* XP & Level */}
          <div style={{
            ...sectionStyle,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05))',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 30px rgba(99,102,241,0.4)',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'white' }}>
                {level}
              </span>
            </div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600 }}>
              Level {level} Scholar
            </h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
              {xp} XP — {500 - (xp % 500)} XP to next level
            </div>
            <div style={{
              width: '100%', maxWidth: '300px', height: 10, borderRadius: 5,
              background: 'var(--bg-deep)', margin: '0 auto',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 5,
                background: 'linear-gradient(90deg, var(--primary), var(--violet))',
                width: `${xpProgress}%`,
                transition: 'width 1s var(--smooth)',
                boxShadow: '0 0 10px rgba(99,102,241,0.5)',
              }} />
            </div>
          </div>

          {/* Badge Wall */}
          <div style={sectionStyle}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '20px' }}>
              🏅 Badge Collection
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
              {badges.map((badge, i) => (
                <div key={i} style={{
                  padding: '20px 16px',
                  borderRadius: 'var(--radius-lg)',
                  background: badge.earned ? 'rgba(99,102,241,0.08)' : 'var(--bg-deep)',
                  border: `1px solid ${badge.earned ? 'rgba(99,102,241,0.3)' : 'var(--border-default)'}`,
                  textAlign: 'center',
                  opacity: badge.earned ? 1 : 0.4,
                  animation: badge.earned ? `float 3s ease-in-out infinite ${i * 0.2}s` : 'none',
                  transition: 'all 0.4s var(--spring)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                  if (badge.earned) e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{badge.icon}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>{badge.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{badge.desc}</div>
                  {badge.earned && (
                    <div style={{
                      marginTop: '8px', padding: '2px 8px', borderRadius: 'var(--radius-full)',
                      background: 'rgba(16,185,129,0.15)', color: '#10b981',
                      fontSize: '0.65rem', fontWeight: 700, display: 'inline-block',
                    }}>✓ EARNED</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div style={sectionStyle}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px' }}>
              🏆 Class Leaderboard — Top 5
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {allAvgs.map((avg, i) => ({ id: i + 1, avg }))
                .sort((a, b) => b.avg - a.avg)
                .slice(0, 5)
                .map((student, rank) => {
                  const isMe = student.id === studentId;
                  const medals = ['🥇', '🥈', '🥉'];
                  return (
                    <div key={student.id} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 16px', borderRadius: 'var(--radius-md)',
                      background: isMe ? 'rgba(99,102,241,0.1)' : 'var(--bg-deep)',
                      border: `1px solid ${isMe ? 'rgba(99,102,241,0.3)' : 'var(--border-default)'}`,
                      animation: isMe ? 'glowPulse 2s ease-in-out infinite' : 'none',
                    }}>
                      <span style={{ fontSize: '1.2rem', width: '32px', textAlign: 'center' }}>
                        {medals[rank] || `#${rank + 1}`}
                      </span>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: isMe ? 'linear-gradient(135deg, var(--primary), var(--violet))' : 'var(--bg-card)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isMe ? 'white' : 'var(--text-muted)',
                        fontSize: '0.65rem', fontWeight: 700,
                      }}>S{student.id}</div>
                      <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: isMe ? 600 : 400 }}>
                        {isMe ? `${user?.name || 'You'} (You)` : `Student ${student.id}`}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem',
                        color: isMe ? 'var(--primary)' : 'var(--text-secondary)',
                      }}>{student.avg}%</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function getGradeInfo(marks) {
  if (marks >= 90) return { grade: 'A+', color: '#10b981' };
  if (marks >= 80) return { grade: 'A', color: '#22c55e' };
  if (marks >= 70) return { grade: 'B+', color: '#06b6d4' };
  if (marks >= 60) return { grade: 'B', color: '#3b82f6' };
  if (marks >= 50) return { grade: 'C', color: '#f59e0b' };
  if (marks >= 40) return { grade: 'D', color: '#f97316' };
  return { grade: 'F', color: '#f43f5e' };
}
