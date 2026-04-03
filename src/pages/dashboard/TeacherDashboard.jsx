import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import students from '../../data/students';
import marks, { getLatestMarks, getAverageMarks, getClassAverage } from '../../data/marks';
import { getAttendanceRate, getTodayAttendance, getAttendanceStreak, getMonthlyHeatmap } from '../../data/attendance';
import aiInsights from '../../data/aiInsights';
import StatCard from '../../components/ui/StatCard';
import AIInsightBox from '../../components/ui/AIInsightBox';
import GradientButton from '../../components/ui/GradientButton';
import PerformanceChart from '../../components/charts/PerformanceChart';
import AttendanceChart from '../../components/charts/AttendanceChart';
import HeatmapCalendar from '../../components/charts/HeatmapCalendar';
import RiskDetector from '../../components/ai/RiskDetector';
import AIFeedbackPanel from '../../components/ai/AIFeedbackPanel';
import useAI from '../../hooks/useAI';
import { useNotification } from '../../context/NotificationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function TeacherDashboard() {
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

  const [todayAttendance, setTodayAttendance] = useState(getTodayAttendance());
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [aiPanelVisible, setAiPanelVisible] = useState(false);
  const [dismissedInsights, setDismissedInsights] = useState([]);
  const { generateResponse, loading: aiLoading } = useAI();
  const { success, info } = useNotification();

  const class10A = students.filter(s => s.class === '10A');
  const presentCount = Object.values(todayAttendance).filter(Boolean).length;
  const presentPercent = Math.round((presentCount / students.length) * 100);
  const atRiskCount = students.filter(s => {
    const avg = getAverageMarks(s.id);
    const att = getAttendanceRate(s.id);
    return avg < 50 || att < 75;
  }).length;

  // Chart data
  const subjectAvgs = marks.subjects.map(s => ({
    name: s.length > 6 ? s.slice(0, 6) + '.' : s,
    fullName: s,
    avg: getClassAverage(s),
  }));

  const attendanceTrend = Array.from({ length: 10 }, (_, i) => ({
    name: `Day ${i + 1}`,
    rate: Math.round(70 + Math.random() * 25),
  }));

  const performanceTrend = [
    { name: 'Test 1', score: 62, classAvg: 58 },
    { name: 'Test 2', score: 65, classAvg: 60 },
    { name: 'Test 3', score: 61, classAvg: 59 },
    { name: 'Test 4', score: 68, classAvg: 63 },
  ];

  const gradeDistribution = [
    { name: 'A+', value: 3, color: '#10b981' },
    { name: 'A', value: 4, color: '#22c55e' },
    { name: 'B', value: 3, color: '#06b6d4' },
    { name: 'C', value: 2, color: '#f59e0b' },
    { name: 'D', value: 1, color: '#f97316' },
    { name: 'F', value: 2, color: '#f43f5e' },
  ];

  const toggleAttendance = (studentId) => {
    setTodayAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const markAll = (present) => {
    const updated = {};
    students.forEach(s => { updated[s.id] = present; });
    setTodayAttendance(updated);
    success(present ? 'All marked present' : 'All marked absent');
  };

  const sectionStyle = {
    padding: '24px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '24px',
  };

  return (
    <div>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon="👥" value={students.length} label="Total Students" color="var(--primary)" delay={0} />
        <StatCard icon="✅" value={presentPercent} suffix="%" label="Present Today" color="var(--emerald)" delay={1} />
        <StatCard icon="⚠️" value={atRiskCount} label="At Risk (AI)" color="var(--danger)" delay={2} />
        <StatCard icon="📋" value={3} label="Pending Reports" color="var(--warning)" delay={3} />
      </div>

      {/* Quick Nav Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['overview', 'attendance', 'marks', 'risk', 'insights', 'reports'].map(tab => (
          <button key={tab} onClick={() => handleTabChange(tab)} style={{
            padding: '8px 18px', borderRadius: 'var(--radius-full)',
            background: activeSection === tab ? 'linear-gradient(135deg, var(--primary), var(--violet))' : 'var(--bg-card)',
            border: activeSection === tab ? 'none' : '1px solid var(--border-default)',
            color: activeSection === tab ? 'white' : 'var(--text-secondary)',
            fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize',
            transition: 'all 0.3s var(--spring)',
          }}>{tab}</button>
        ))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {activeSection === 'overview' && (
        <>
          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <PerformanceChart data={performanceTrend} title="📈 Class Performance Trend" />
            <AttendanceChart data={attendanceTrend} title="📋 Attendance Trend (10 Days)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Subject Comparison */}
            <div style={sectionStyle}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px' }}>
                📊 Subject-wise Average
              </h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={subjectAvgs}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'rgba(2,8,23,0.95)', border: '1px solid var(--border-default)', borderRadius: 8 }} />
                  <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Grade Distribution */}
            <div style={sectionStyle}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px' }}>
                🎯 Grade Distribution
              </h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {gradeDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(2,8,23,0.95)', border: '1px solid var(--border-default)', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Teaching Suggestions */}
          <div style={sectionStyle}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🧠 AI Teaching Co-Pilot
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {aiInsights.classInsights.filter(i => !dismissedInsights.includes(i.id)).map(insight => (
                <div key={insight.id} style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-deep)',
                  border: '1px solid var(--border-default)',
                  animation: 'floatSubtle 4s ease-in-out infinite',
                  transition: 'all 0.3s var(--spring)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase' }}>
                      {insight.icon} {insight.title}
                    </span>
                    <button onClick={() => setDismissedInsights(p => [...p, insight.id])} style={{
                      background: 'none', color: 'var(--text-muted)', fontSize: '14px', padding: 0,
                    }}>✕</button>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{insight.text}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--ai-glow)', marginBottom: '12px' }}>→ {insight.action}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(135deg, var(--primary), var(--violet))',
                      color: 'white', fontSize: '0.75rem', fontWeight: 600,
                    }} onClick={() => info('Action applied!')}>{insight.actionLabel}</button>
                    <button onClick={() => setDismissedInsights(p => [...p, insight.id])} style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                      color: 'var(--text-muted)', fontSize: '0.75rem',
                    }}>Dismiss</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══ ATTENDANCE ═══ */}
      {activeSection === 'attendance' && (
        <>
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600 }}>
                📋 Smart Attendance Panel
              </h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => markAll(true)} style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                  color: '#10b981', fontSize: '0.8rem', fontWeight: 600,
                }}>✅ Mark All Present</button>
                <button onClick={() => markAll(false)} style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)',
                  color: '#f43f5e', fontSize: '0.8rem', fontWeight: 600,
                }}>❌ Mark All Absent</button>
                <GradientButton size="sm" onClick={() => setAiPanelVisible(!aiPanelVisible)}>
                  🧠 Analyze with AI
                </GradientButton>
              </div>
            </div>

            {/* Student Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['', 'Name', 'Roll No', 'Status', 'Streak', 'Attendance %'].map(h => (
                      <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => {
                    const isPresent = todayAttendance[student.id];
                    return (
                      <tr key={student.id} style={{ borderBottom: '1px solid var(--border-default)', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px' }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--violet))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '0.7rem', fontWeight: 700,
                          }}>{student.avatar}</div>
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.9rem', fontWeight: 500 }}>{student.name}</td>
                        <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{student.rollNo}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => toggleAttendance(student.id)} style={{
                            padding: '6px 16px',
                            borderRadius: 'var(--radius-full)',
                            background: isPresent ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)',
                            border: `1px solid ${isPresent ? '#10b981' : '#f43f5e'}40`,
                            color: isPresent ? '#10b981' : '#f43f5e',
                            fontSize: '0.8rem', fontWeight: 600,
                            transition: 'all 0.3s var(--spring)',
                            minWidth: '80px',
                          }}>
                            {isPresent ? '✓ Present' : '✗ Absent'}
                          </button>
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                          🔥 {getAttendanceStreak(student.id)} days
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg-deep)', maxWidth: '80px' }}>
                              <div style={{ height: '100%', borderRadius: 3, background: getAttendanceRate(student.id) > 75 ? '#10b981' : '#f43f5e', width: `${getAttendanceRate(student.id)}%`, transition: 'width 0.5s' }} />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{getAttendanceRate(student.id)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Panel */}
          {aiPanelVisible && (
            <AIInsightBox
              title="Attendance Pattern Analysis"
              prompt="Analyze attendance patterns for a class of 15 students over the past month. Identify day-of-week patterns, individual concerns, and recommendations."
              onGenerate={(prompt, onStream) => generateResponse(prompt, onStream)}
            />
          )}

          {/* Heatmap */}
          <div style={{ marginTop: '24px' }}>
            <HeatmapCalendar data={getMonthlyHeatmap(1)} title="📅 Monthly Attendance Heatmap (Sample: Aarav)" />
          </div>
        </>
      )}

      {/* ═══ MARKS ═══ */}
      {activeSection === 'marks' && (
        <>
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600 }}>
                ✏️ Marks Entry & AI Feedback
              </h4>
              {/* Subject Tabs */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {marks.subjects.map(s => (
                  <button key={s} onClick={() => setSelectedSubject(s)} style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-full)',
                    background: selectedSubject === s ? 'var(--primary)' : 'var(--bg-deep)',
                    color: selectedSubject === s ? 'white' : 'var(--text-muted)',
                    fontSize: '0.8rem', fontWeight: 600, border: selectedSubject === s ? 'none' : '1px solid var(--border-default)',
                    transition: 'all 0.3s',
                  }}>{s}</button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Name', 'Marks', 'Grade', 'AI Feedback'].map(h => (
                      <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => {
                    const latestMarks = getLatestMarks(student.id);
                    const subjectMark = latestMarks[selectedSubject] || 0;
                    const gradeInfo = getGradeInfo(subjectMark);
                    return (
                      <tr key={student.id} style={{ borderBottom: '1px solid var(--border-default)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--violet))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '0.65rem', fontWeight: 700,
                          }}>{student.avatar}</div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{student.name}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: gradeInfo.color }}>{subjectMark}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/100</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 'var(--radius-full)',
                            background: `${gradeInfo.color}15`, color: gradeInfo.color,
                            fontSize: '0.75rem', fontWeight: 700,
                          }}>{gradeInfo.grade}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => setSelectedStudent(student)} style={{
                            padding: '6px 14px', borderRadius: 'var(--radius-full)',
                            background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)',
                            color: 'var(--ai-glow)', fontSize: '0.75rem', fontWeight: 600,
                          }}>🧠 Generate</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Class Average */}
          <div style={{ marginBottom: '24px', padding: '16px 20px', borderRadius: 'var(--radius-md)', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.2rem' }}>📊</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Class Average for <strong>{selectedSubject}</strong>: <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--cyan)' }}>{getClassAverage(selectedSubject)}%</span>
            </span>
          </div>

          {selectedStudent && (
            <AIFeedbackPanel student={selectedStudent} marks={getLatestMarks(selectedStudent.id)} />
          )}
        </>
      )}

      {/* ═══ RISK ═══ */}
      {activeSection === 'risk' && <RiskDetector />}

      {/* ═══ INSIGHTS ═══ */}
      {activeSection === 'insights' && (
        <AIInsightBox
          title="AI Teaching Suggestions"
          prompt="Based on class performance data, suggest specific teaching improvements, scheduling optimizations, and student engagement techniques."
          onGenerate={(prompt, onStream) => generateResponse(prompt, onStream)}
        />
      )}

      {/* ═══ REPORTS ═══ */}
      {activeSection === 'reports' && (
        <div style={sectionStyle}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>
            📄 AI Report Generator
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {['Progress Report', 'Attendance Report', 'Full Report Card', 'Risk Report'].map(type => (
              <button key={type} style={{
                padding: '16px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-deep)', border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500,
                transition: 'all 0.3s var(--spring)', textAlign: 'left',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.transform = ''; }}
              onClick={() => info(`Generating ${type}...`)}
              >
                📋 {type}
              </button>
            ))}
          </div>
          <AIInsightBox
            title="Report Card Generator"
            prompt="Generate a comprehensive report card for the class with per-student analysis, grades, attendance, and teacher recommendations."
            onGenerate={(prompt, onStream) => generateResponse(prompt, onStream)}
          />
        </div>
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
