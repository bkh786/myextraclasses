'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

export default function TeacherPerformancePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Student Performance Tracking</h1>
        <p style={{ color: 'var(--muted)' }}>Log marks and analyze batch performance metrics.</p>
      </div>

      <div className="card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--muted)' }}>
        <BarChart3 size={48} color="#cbd5e1" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--foreground)' }}>No tests logged recently</h3>
        <p>Record test scores for your batches to visualize interactive performance charts.</p>
      </div>
    </div>
  );
}
