'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { BookOpen, Calendar, Clock, GraduationCap, BarChart3, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Welcome, {user?.name}! 👋</h1>
        <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Your academic journey at Extra Classes.</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#e0e7ff', color: 'var(--primary)', borderRadius: '12px' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Active Courses</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>2</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '12px' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Attendance</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>94%</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', color: '#f59e0b', borderRadius: '12px' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Next Class</div>
              <div style={{ fontSize: '1rem', fontWeight: '700' }}>4:00 PM Today</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#fdf2f2', color: '#ef4444', borderRadius: '12px' }}>
              <BarChart3 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Avg. Marks</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>88%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          backgroundColor: '#f1f5f9', 
          color: 'var(--muted)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <AlertCircle size={32} />
        </div>
        <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Coming Soon</h3>
        <p style={{ color: 'var(--muted)', maxWidth: '400px', margin: '0 auto' }}>
          We are currently finalizing your personalized student portal. Check back soon for detailed study tracking!
        </p>
      </div>
    </div>
  );
}
