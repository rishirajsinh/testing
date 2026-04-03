import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Toast from '../components/ui/Toast';
import useCounter from '../hooks/useCounter';

/* ─── Particle Canvas ─── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        // Mouse repel
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      // Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };

    const handleMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('click', (e) => {
      particles.forEach(p => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += dx * 0.05;
          p.vy += dy * 0.05;
        }
      });
    });

    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'all' }} />;
}

/* ─── Typewriter ─── */
function Typewriter({ texts, speed = 80, pause = 2000 }) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIndex(c => c + 1);
        }
      } else {
        setText(current.slice(0, charIndex));
        if (charIndex === 0) {
          setDeleting(false);
          setIndex((index + 1) % texts.length);
        } else {
          setCharIndex(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index, texts, speed, pause]);

  return (
    <span>
      {text}
      <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--ai-glow)' }}>|</span>
    </span>
  );
}

/* ─── Scroll Reveal Wrapper ─── */
function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.7s var(--smooth) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ─── Stat Counter ─── */
function AnimatedStat({ value, suffix, label }) {
  const { count, start } = useCounter(value, 2000, false);
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !vis) { setVis(true); start(); } }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [vis, start]);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ icon, title, desc, animation, delay = 0 }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: '28px',
      backdropFilter: 'blur(20px)',
      animation: `float 3s ease-in-out infinite ${delay}s`,
      transition: 'all 0.4s var(--spring)',
      cursor: 'pointer',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
      e.currentTarget.style.boxShadow = '0 30px 60px rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.2)';
      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = '';
      e.currentTarget.style.borderColor = 'var(--border-default)';
    }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
      {animation && <div style={{ marginTop: '16px' }}>{animation}</div>}
    </div>
  );
}

/* ─── Mini Animations ─── */
function MiniProgressBar({ value, color = 'var(--primary)', delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW(value), 300 + delay); }, [value, delay]);
  return (
    <div style={{ height: 6, background: 'var(--bg-deep)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 3, transition: 'width 1.5s var(--smooth)' }} />
    </div>
  );
}

function MiniHeatmap() {
  const cells = Array.from({ length: 20 }, () => Math.random() > 0.3);
  return (
    <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {cells.map((v, i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: v ? '#10b981' : '#f43f5e', opacity: 0.7 }} />
      ))}
    </div>
  );
}

function MiniRiskMeter() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #10b981, #f59e0b, #f43f5e)' }} />
      <div style={{
        width: 12, height: 12, borderRadius: '50%', background: '#f59e0b',
        boxShadow: '0 0 10px rgba(245,158,11,0.5)', animation: 'pulse 1.5s ease-in-out infinite',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN LANDING PAGE COMPONENT
   ═══════════════════════════════════════ */

export default function Landing() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [pricingMonthly, setPricingMonthly] = useState(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials = [
    { name: 'Dr. Priya Menon', role: 'Principal, DPS Bangalore', text: 'EduFlow AI reduced our admin workload by 70%. The AI insights are genuinely transformative — we caught 15 at-risk students before mid-terms.', avatar: 'PM' },
    { name: 'Rajesh Kumar', role: 'Math Teacher, KV Delhi', text: 'The AI teaching suggestions are spot-on. It identified that my Monday tests were scoring 23% lower. Moving them to Wednesday changed everything.', avatar: 'RK' },
    { name: 'Aarav Sharma', role: 'Student, Class 10', text: 'The AI study plan helped me boost my Math score from 42 to 78 in one term. The personalized schedule was a game-changer.', avatar: 'AS' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex(i => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: '🧠', title: 'AI Report Generator', desc: 'Generates full PDF-ready report cards in 3 seconds with personalized teacher comments.', animation: <MiniProgressBar value={95} color="var(--primary)" /> },
    { icon: '⚠️', title: 'Student Risk Detector', desc: 'Identifies at-risk students 3 weeks before failure with 91% confidence.', animation: <MiniRiskMeter /> },
    { icon: '📈', title: 'Performance Predictor', desc: 'Predicts end-term scores with 94% accuracy using historical trend analysis.', animation: <MiniProgressBar value={94} color="var(--cyan)" delay={200} /> },
    { icon: '💡', title: 'Smart Teaching Suggestions', desc: 'AI recommends lesson plans based on class weakness patterns.', animation: <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{['Algebra Revision', 'Lab Session', 'Quiz'].map(c => <span key={c} style={{ padding: '4px 10px', borderRadius: 12, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.7rem', color: 'var(--primary-light)' }}>{c}</span>)}</div> },
    { icon: '🎯', title: 'Auto Attendance Analyzer', desc: 'Detects patterns like "Mondays see 40% drop" and suggests interventions.', animation: <MiniHeatmap /> },
    { icon: '📊', title: 'Sentiment Analysis', desc: 'Analyzes student engagement from participation data and flags disengagement.', animation: <MiniProgressBar value={72} color="var(--emerald)" delay={400} /> },
  ];

  const tabContent = {
    attendance: { title: 'Smart Attendance', desc: 'Toggle-based marking with AI pattern detection', visual: '📋' },
    marks: { title: 'Marks Management', desc: 'Subject-wise entry with auto-grading and AI feedback', visual: '✏️' },
    reports: { title: 'AI Reports', desc: 'One-click PDF report generation with personalized comments', visual: '📄' },
    risk: { title: 'Risk Detection', desc: 'Real-time risk scoring with intervention recommendations', visual: '⚠️' },
  };

  const roles = [
    { icon: '👨‍🏫', title: 'Teacher', desc: 'Manage attendance, enter marks, get AI-powered insights, and generate reports effortlessly.', features: ['AI Feedback', 'Risk Detection', 'Smart Reports', 'Attendance Analysis'], color: 'var(--primary)' },
    { icon: '🎓', title: 'Student', desc: 'Track your performance, get personalized study plans, and compete with gamification.', features: ['AI Study Plans', 'Performance Tracking', 'Achievements', 'Report Cards'], color: 'var(--cyan)' },
    { icon: '🏫', title: 'Admin', desc: 'School-wide analytics, teacher management, and AI-driven strategic insights.', features: ['School Analytics', 'Teacher Mgmt', 'AI Insights', 'Announcements'], color: 'var(--violet)' },
  ];

  const pricingPlans = [
    { name: 'Free', price: 0, desc: 'For individual teachers', features: ['Up to 30 students', 'Basic attendance', 'Manual reports', 'Dark/Light mode', 'Email support'], highlighted: false },
    { name: 'Pro', price: pricingMonthly ? 29 : 24, desc: 'For schools & departments', features: ['Unlimited students', 'All AI features', 'Risk detection', 'PDF exports', 'Priority support', 'API access', 'Custom branding'], highlighted: true },
    { name: 'Enterprise', price: pricingMonthly ? 99 : 79, desc: 'For institutions', features: ['Multi-school support', 'Advanced analytics', 'SSO integration', 'Dedicated support', 'SLA guarantee', 'Custom AI models', 'On-premise option', 'Training included'], highlighted: false },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <ParticleCanvas />
      <Navbar />
      <Toast />

      {/* ═══ HERO SECTION ═══ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 32px 80px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(167, 139, 250, 0.1)',
            border: '1px solid rgba(167, 139, 250, 0.3)',
            fontSize: '0.85rem',
            color: 'var(--ai-glow)',
            marginBottom: '32px',
            animation: 'float 3s ease-in-out infinite',
          }}>
            ✦ Powered by Claude AI
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '24px',
          }}>
            <span className="gradient-text">AI-Powered Academic</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>Automation That </span>
            <span className="gradient-text-cyan">Defies Gravity</span>
          </h1>

          {/* Typewriter subtitle */}
          <div style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            height: '40px',
          }}>
            <Typewriter
              texts={['Automate Attendance Tracking', 'Predict Student Risk with AI', 'Generate Smart Reports Instantly', 'Reduce 80% Admin Workload']}
              speed={70}
              pause={2500}
            />
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            <Link to="/register" className="btn-gradient" style={{ padding: '14px 36px', fontSize: '1.05rem' }}>
              <span>Get Started Free →</span>
            </Link>
            <button className="btn-outline" style={{ padding: '14px 36px', fontSize: '1.05rem' }}>
              <span>Watch Demo ▶</span>
            </button>
          </div>

          {/* Stats Ticker */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            flexWrap: 'wrap',
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            backdropFilter: 'blur(20px)',
          }}>
            <AnimatedStat value={10000} suffix="+" label="Teachers" />
            <AnimatedStat value={500000} suffix="+" label="Students" />
            <AnimatedStat value={98} suffix="%" label="Accuracy" />
          </div>

          {/* Scroll indicator */}
          <div style={{
            marginTop: '48px',
            animation: 'bounce 2s ease-in-out infinite',
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Scroll to explore</div>
            <div style={{ fontSize: '1.2rem' }}>↓</div>
          </div>
        </div>
      </section>

      {/* ═══ AI FEATURES SECTION ═══ */}
      <section id="features" style={{
        position: 'relative', zIndex: 1,
        padding: '100px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              display: 'inline-block', padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontSize: '0.8rem', color: 'var(--primary-light)', marginBottom: '16px',
            }}>🧠 AI Features</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '16px' }}>
              The <span className="gradient-text">AI Brain</span> Behind EduFlow
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Powered by state-of-the-art language models, EduFlow transforms raw academic data into actionable intelligence.
            </p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <FeatureCard {...f} delay={i * 0.3} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ INTERACTIVE FEATURE SHOWCASE ═══ */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '80px 32px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700 }}>
              See It In <span className="gradient-text">Action</span>
            </h2>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
            {Object.keys(tabContent).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  background: activeTab === tab ? 'linear-gradient(135deg, var(--primary), var(--violet))' : 'var(--bg-card)',
                  border: activeTab === tab ? 'none' : '1px solid var(--border-default)',
                  color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                  fontSize: '0.85rem', fontWeight: 600,
                  transition: 'all 0.3s var(--spring)',
                  textTransform: 'capitalize',
                }}
              >{tab}</button>
            ))}
          </div>

          {/* Content */}
          <div style={{
            padding: '40px',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            textAlign: 'center',
            animation: 'fadeIn 0.4s ease',
          }} key={activeTab}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{tabContent[activeTab].visual}</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '8px' }}>
              {tabContent[activeTab].title}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>{tabContent[activeTab].desc}</p>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" style={{
        position: 'relative', zIndex: 1,
        padding: '100px 32px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700 }}>
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>
        </ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {[
            { step: '01', icon: '👥', title: 'Add Students', desc: 'Import or add student data to your class' },
            { step: '02', icon: '📋', title: 'Mark Attendance', desc: 'Quick toggle-based daily attendance' },
            { step: '03', icon: '🧠', title: 'AI Analyzes', desc: 'AI processes data for patterns & risks' },
            { step: '04', icon: '📊', title: 'Get Insights', desc: 'Actionable insights and smart reports' },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div style={{
                textAlign: 'center',
                padding: '32px 20px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                animation: `float 3s ease-in-out infinite ${i * 0.4}s`,
                transition: 'all 0.4s var(--spring)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>STEP {item.step}</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: '8px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ ROLES SECTION ═══ */}
      <section id="roles" style={{
        position: 'relative', zIndex: 1,
        padding: '100px 32px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700 }}>
              Built for <span className="gradient-text">Every Role</span>
            </h2>
          </div>
        </ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {roles.map((role, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div style={{
                padding: '32px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-card)',
                border: `1px solid ${role.color}20`,
                animation: `float 3s ease-in-out infinite ${i * 0.4}s`,
                transition: 'all 0.4s var(--spring)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 30px 60px ${role.color}30`;
                e.currentTarget.style.borderColor = `${role.color}50`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.borderColor = `${role.color}20`;
              }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{role.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 600, marginBottom: '8px', color: role.color }}>{role.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>{role.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {role.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: role.color }}>✦</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '100px 32px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700 }}>
              What People <span className="gradient-text">Say</span>
            </h2>
          </div>
          <div style={{
            padding: '40px',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            textAlign: 'center',
            animation: 'float 3s ease-in-out infinite',
            transition: 'all 0.5s ease',
          }} key={testimonialIndex}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '1rem',
              margin: '0 auto 20px',
            }}>{testimonials[testimonialIndex].avatar}</div>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.7 }}>
              "{testimonials[testimonialIndex].text}"
            </p>
            <div style={{ fontWeight: 600 }}>{testimonials[testimonialIndex].name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{testimonials[testimonialIndex].role}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIndex(i)} style={{
                  width: i === testimonialIndex ? 24 : 8, height: 8,
                  borderRadius: 4,
                  background: i === testimonialIndex ? 'var(--primary)' : 'var(--border-default)',
                  transition: 'all 0.3s ease',
                  border: 'none',
                }} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={{
        position: 'relative', zIndex: 1,
        padding: '100px 32px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            {/* Toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '4px', borderRadius: 'var(--radius-full)', background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              <button onClick={() => setPricingMonthly(true)} style={{
                padding: '8px 20px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600,
                background: pricingMonthly ? 'var(--primary)' : 'transparent',
                color: pricingMonthly ? 'white' : 'var(--text-secondary)',
                border: 'none', transition: 'all 0.3s',
              }}>Monthly</button>
              <button onClick={() => setPricingMonthly(false)} style={{
                padding: '8px 20px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600,
                background: !pricingMonthly ? 'var(--primary)' : 'transparent',
                color: !pricingMonthly ? 'white' : 'var(--text-secondary)',
                border: 'none', transition: 'all 0.3s', position: 'relative',
              }}>
                Yearly
                <span style={{
                  position: 'absolute', top: -8, right: -8,
                  padding: '2px 6px', borderRadius: 'var(--radius-full)',
                  background: 'var(--emerald)', color: 'white',
                  fontSize: '0.6rem', fontWeight: 700,
                }}>-20%</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {pricingPlans.map((plan, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div style={{
                padding: '32px',
                borderRadius: 'var(--radius-xl)',
                background: plan.highlighted ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)',
                border: `1px solid ${plan.highlighted ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-default)'}`,
                animation: plan.highlighted ? 'aiGlow 3s ease-in-out infinite' : `float 3s ease-in-out infinite ${i * 0.3}s`,
                transition: 'all 0.4s var(--spring)',
                position: 'relative',
                ...(plan.highlighted && { transform: 'scale(1.05)' }),
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = `translateY(-8px) ${plan.highlighted ? 'scale(1.07)' : 'scale(1.02)'}`;
                e.currentTarget.style.boxShadow = 'var(--shadow-lift)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = plan.highlighted ? 'scale(1.05)' : '';
                e.currentTarget.style.boxShadow = '';
              }}
              >
                {plan.highlighted && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    padding: '4px 16px', borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--primary), var(--violet))',
                    color: 'white', fontSize: '0.75rem', fontWeight: 700,
                  }}>MOST POPULAR</div>
                )}
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '4px' }}>{plan.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>{plan.desc}</p>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700, marginBottom: '4px' }}>
                  ${plan.price}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span>
                </div>
                <Link to="/register" className={plan.highlighted ? 'btn-gradient' : 'btn-outline'} style={{
                  display: 'block', textAlign: 'center', marginTop: '20px', marginBottom: '24px',
                  padding: '12px', width: '100%', borderRadius: 'var(--radius-md)',
                }}>
                  <span>Get Started</span>
                </Link>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--emerald)' }}>✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '80px 32px',
        margin: '60px 32px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
        border: '1px solid rgba(99,102,241,0.3)',
        textAlign: 'center',
        maxWidth: '1000px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '16px' }}>
          Start Automating Today — <span className="gradient-text">Free Forever</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
          Join 10,000+ educators already using AI to transform their classrooms.
        </p>
        <Link to="/register" className="btn-gradient" style={{ padding: '16px 48px', fontSize: '1.1rem' }}>
          <span>Get Started Free →</span>
        </Link>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        position: 'relative', zIndex: 1,
        padding: '60px 32px 40px',
        borderTop: '1px solid var(--border-default)',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary), var(--violet))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}>🧠</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem' }}>EduFlow AI</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '250px' }}>
              AI-powered academic administration that defies gravity.
            </p>
          </div>
          {/* Links */}
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'API', 'Changelog'] },
            { title: 'Resources', links: ['Documentation', 'Blog', 'Community', 'Support'] },
            { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' }}>{col.title}</h4>
              {col.links.map(link => (
                <div key={link} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '4px 0', cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{link}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
          paddingTop: '24px', borderTop: '1px solid var(--border-default)',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© 2026 EduFlow AI. All rights reserved.</div>
          <div style={{
            display: 'inline-flex', padding: '6px 14px', borderRadius: 'var(--radius-full)',
            background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)',
            fontSize: '0.75rem', color: 'var(--ai-glow)',
          }}>Built with AI ✦</div>
        </div>
      </footer>
    </div>
  );
}
