'use client';

import React from 'react';
import { Users, Clock, Upload, GraduationCap, ArrowUpRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function TeacherDashboard() {
  const { user } = useAuth();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--foreground)' }}>
          Welcome back, {user?.name || 'Teacher'} 👋
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: '0.25rem' }}>Here's what's happening in your classes today.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* KPI Cards */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted)' }}>Today's Classes</span>
            <Clock size={18} color="#6366f1" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>3</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ArrowUpRight size={14} /> Next class in 45 mins
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted)' }}>Total Students</span>
            <Users size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>42</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Across 4 active batches</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted)' }}>Homework Pending</span>
            <Upload size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>12</div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Requires grading today
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted)' }}>Avg Rating</span>
            <GraduationCap size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>4.8<span style={{ fontSize: '1rem', color: 'var(--muted)' }}>/5</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>From 38 reviews</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Upcoming Classes */}
        <div className="card" style={{ padding: '0' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700' }}>Today's Schedule</h2>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>View Calendar</button>
          </div>
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>{i === 1 ? '4:00' : '5:30'}</span>
                    <span style={{ fontSize: '0.65rem' }}>PM</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>Mathematics - Grade 10</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>15 Students Enrolled</div>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ fontSize: '0.875rem' }}>Start Class</button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ padding: '0' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--card-border)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700' }}>Quick Actions</h2>
          </div>
          <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ height: '80px', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              <CheckCircle2 size={24} color="#10b981" />
              Mark Attendance
            </button>
            <button className="btn btn-secondary" style={{ height: '80px', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              <Upload size={24} color="#6366f1" />
              Upload Homework
            </button>
            <button className="btn btn-secondary" style={{ height: '80px', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              <GraduationCap size={24} color="#8b5cf6" />
              Enter Marks
            </button>
            <button className="btn btn-secondary" style={{ height: '80px', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              <TrendingUp size={24} color="#f59e0b" />
              View Earnings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
