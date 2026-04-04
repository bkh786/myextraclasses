'use client';

import React from 'react';
import { Upload, FileText, Plus, CheckCircle2 } from 'lucide-react';

export default function TeacherHomeworkPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Homework Management</h1>
          <p style={{ color: 'var(--muted)' }}>Assign and grade homework for your batches</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Create Assignment
        </button>
      </div>

      <div className="card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--muted)' }}>
        <Upload size={48} color="#cbd5e1" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--foreground)' }}>No active assignments</h3>
        <p>Click the button above to create and upload homework materials for your upcoming classes.</p>
      </div>
    </div>
  );
}
