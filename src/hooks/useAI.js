import { useState, useCallback } from 'react';

export default function useAI() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  const generateResponse = useCallback(async (prompt, onStream) => {
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      // Try real API first
      const apiKey = localStorage.getItem('eduflow_api_key');
      
      if (apiKey) {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.content[0].text;
          
          // Typewriter effect
          if (onStream) {
            for (let i = 0; i < text.length; i++) {
              await new Promise(r => setTimeout(r, 15));
              onStream(text.slice(0, i + 1));
            }
          }
          
          setResponse(text);
          setLoading(false);
          return text;
        }
      }

      // Fallback to simulated AI response
      const simulatedResponse = getSimulatedResponse(prompt);
      
      if (onStream) {
        for (let i = 0; i < simulatedResponse.length; i++) {
          await new Promise(r => setTimeout(r, 15));
          onStream(simulatedResponse.slice(0, i + 1));
        }
      }

      setResponse(simulatedResponse);
      setLoading(false);
      return simulatedResponse;
    } catch (err) {
      // Fallback 
      const fallback = getSimulatedResponse(prompt);
      if (onStream) {
        for (let i = 0; i < fallback.length; i++) {
          await new Promise(r => setTimeout(r, 15));
          onStream(fallback.slice(0, i + 1));
        }
      }
      setResponse(fallback);
      setLoading(false);
      return fallback;
    }
  }, []);

  return { loading, response, error, generateResponse };
}

function getSimulatedResponse(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes('feedback') || lower.includes('report')) {
    return `🤖 AI Analysis Report

✅ Strengths Identified:
• Strong performance in Science (89/100) and English (84/100)
• Consistent attendance record showing dedication
• Improvement trend visible in last 3 assessments

⚠️ Areas Needing Attention:
• Mathematics (41/100) — Algebra and Trigonometry concepts need reinforcement
• Problem-solving speed is below class average

📈 Predicted Improvement:
• With targeted practice: +15 marks improvement expected in Mathematics
• Recommended focus: 2 hours daily on weak chapters

💡 Suggestions:
• Assign Chapter 3-5 revision exercises
• Pair with Sneha P. (top Math performer) for peer tutoring
• Schedule weekly 1-on-1 doubt clearing sessions
• Consider Khan Academy Algebra module supplementation`;
  }

  if (lower.includes('risk') || lower.includes('at-risk')) {
    return `⚠️ Risk Assessment Report

🔴 CRITICAL RISK — 3 Students Identified:

1. Rahul Kumar (STU003)
   • Risk Score: 87/100 (CRITICAL)
   • Attendance: 65% (below 75% threshold)
   • Math Score: 30/100 (failing)
   • Confidence: 91%
   • Action: Immediate parent meeting required

2. Dev Joshi (STU007)
   • Risk Score: 82/100 (CRITICAL)
   • Attendance: 70% (declining trend)
   • Average Score: 36/100 (multiple failing subjects)
   • Confidence: 88%
   • Action: Assign tutoring + counselor referral

3. Vikram Desai (STU009)
   • Risk Score: 78/100 (HIGH)
   • Attendance: 75% (borderline)
   • Average Score: 39/100
   • Confidence: 85%
   • Action: Weekly progress monitoring

📊 Key Patterns:
• All 3 students show attendance-performance correlation
• Monday absences highest (34% of all absences)
• Group study sessions could improve engagement by ~25%

💡 Recommended Interventions:
• Schedule parent-teacher meetings within 1 week
• Create personalized improvement plans
• Peer mentoring program with top performers`;
  }

  if (lower.includes('study plan') || lower.includes('schedule')) {
    return `🧠 Personalized AI Study Plan

📅 Today's Optimized Schedule:

🌅 Morning Session (9:00 AM - 11:00 AM)
📘 Mathematics — Chapter 5: Algebra
   • Focus: Quadratic equations and factoring
   • "Your weakest area — dedicate focused time here"
   • Practice: 15 problems from exercise 5.3
   • 🎯 Goal: Understand completing the square method

☀️ Afternoon Session (2:00 PM - 4:00 PM)
🔬 Physics — Numericals Practice
   • Topic: Newton's Laws numerical problems
   • "Revise formulas before solving problems"
   • Practice: 10 problems from previous year papers
   • 🎯 Goal: Solve 3-step problems independently

🌆 Evening Session (6:00 PM - 7:00 PM)
📖 Quick Review: English Essay Format
   • Review: Argumentative essay structure
   • Practice: Write one 200-word essay
   • 🎯 Goal: Master introduction-body-conclusion flow

💡 Pro Tips:
• Take 10-minute breaks between subjects
• Use Pomodoro technique (25 min focus, 5 min rest)
• Review yesterday's notes before starting new topics
• Stay hydrated and maintain good posture`;
  }

  if (lower.includes('attendance') || lower.includes('pattern')) {
    return `📊 Attendance Pattern Analysis

🔍 Key Patterns Detected:

📉 Day-wise Analysis:
• Monday: 66% average attendance (34% drop — weekend lag effect)
• Tuesday: 88% attendance
• Wednesday: 96% attendance (HIGHEST — best day for important sessions)
• Thursday: 92% attendance
• Friday: 78% attendance (early weekend effect)

⚠️ Individual Alerts:
• Rahul K. — 8 consecutive Friday absences (pattern: recurring issue)
• Dev J. — Declining trend: 90% → 70% over 4 weeks
• Vikram D. — Sporadic absences clustering around test dates

📈 Monthly Trend:
• Week 1: 92% → Week 2: 88% → Week 3: 82% → Week 4: 78%
• Overall downward trend of 14% — requires attention

💡 Recommendations:
• Schedule important lessons on Wednesday (peak attendance)
• Send automated parent alerts for students below 75%
• Implement attendance incentive program
• Move Friday tests to Thursday for better participation
• Consider morning assembly engagement activities on Mondays`;
  }

  if (lower.includes('predict') || lower.includes('performance')) {
    return `📈 Performance Prediction Report

🎯 End-Term Score Predictions (94% model confidence):

Top Performers (Predicted A+, 90+):
• Sneha Patel — Predicted: 95/100 (↑ trending up)
• Riya Nair — Predicted: 93/100 (stable high)
• Aarav Mehta — Predicted: 88/100 (improving)

Moderate Risk (Predicted C-D range):
• Arjun Singh — Predicted: 58/100 (needs 12+ improvement)
• Aditya Banerjee — Predicted: 57/100 (stagnant)

High Risk (Predicted F, Below 40):
• Rahul Kumar — Predicted: 32/100 (declining rapidly)
• Dev Joshi — Predicted: 35/100 (consistent underperformance)
• Vikram Desai — Predicted: 37/100 (attendance affecting scores)

📊 Subject-wise Class Predictions:
• Mathematics: Class avg predicted at 62% (down from 68%)
• Science: Class avg predicted at 71% (stable)
• English: Class avg predicted at 72% (improving)
• Computer Science: Class avg predicted at 73% (highest)

💡 Key Insight:
With targeted intervention for bottom 3 students, class average could improve by 8-12 points across all subjects.`;
  }

  if (lower.includes('teaching') || lower.includes('suggestion')) {
    return `💡 AI Teaching Suggestions

Based on class data analysis, here are personalized recommendations:

📚 Curriculum Adjustments:
1. Mathematics — Increase Algebra practice sessions by 40%
   • 68% of students scoring below 50 in this section
   • Suggest: Visual learning aids + real-world applications

2. Science — Lab sessions are highly effective
   • Students who attend labs score 22% higher 
   • Recommend: Add 1 more lab session per week

3. English — Essay writing needs focus
   • Class average drops 15% in essay components
   • Suggest: Weekly essay assignments with peer review

🎯 Teaching Strategy:
• Implement flipped classroom for Mathematics
• Use gamification for vocabulary building in English
• Peer teaching pairs: Top + struggling students
• Weekly micro-assessments instead of monthly tests

📅 Scheduling Optimizations:
• Move difficult subjects to morning slots (15% better retention)
• Avoid Monday morning tests (23% lower scores)
• Best test days: Wednesday-Thursday
• Keep Science labs in afternoon (practical focus better post-lunch)`;
  }

  return `🤖 AI Analysis Complete

Based on the provided data, here are the key insights:

📊 Overview:
• Overall class performance is trending positively with a 5% improvement
• 3 students have been identified as needing immediate attention
• Attendance patterns show some concerning trends

✅ Positive Indicators:
• 73% of students are performing at or above grade level
• Engagement in Science and Computer Science is high
• Top performers are maintaining consistency

⚠️ Areas for Improvement:
• Mathematics remains the most challenging subject
• Monday attendance needs addressing
• 20% of students need additional support

💡 Recommendations:
• Implement peer tutoring program
• Add interactive learning modules for Mathematics
• Schedule parent-teacher conferences for at-risk students
• Consider after-school support sessions twice weekly`;
}
