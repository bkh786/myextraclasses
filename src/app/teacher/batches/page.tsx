'use client';

import React from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  TrendingUp,
  BookOpen
} from 'lucide-react';

const mockBatches: any[] = [];
const mockStudents: any[] = [];

export default function TeacherBatchesPage() {
  // Simulate only batches for teacher t1
  const teacherBatches = mockBatches.filter(b => b.teacherId === 't1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>My Batches</h1>
        <p style={{ color: 'var(--muted)' }}>Select a batch to manage attendance and marks</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {teacherBatches.map((batch) => (
          <div className="card" key={batch.id} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '1.25rem' }}>{batch.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.875rem' }}>{batch.subject}</p>
              </div>
              <div style={{ padding: '0.5rem', backgroundColor: 'var(--secondary)', borderRadius: '8px' }}>
                <Users size={20} color="var(--primary)" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <Clock size={16} color="var(--muted)" />
                <span>{batch.timing}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <Users size={16} color="var(--muted)" />
                <span>{batch.studentIds.length} / {batch.maxStrength} Students</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <Calendar size={16} color="var(--muted)" />
                <span>Starts: {batch.startDate}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>94% Attendance</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }}>
                Mark Attendance
              </button>
              <button className="btn btn-secondary" style={{ flex: 1 }}>
                Enter Marks
              </button>
            </div>
            
            <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Student List</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {batch.studentIds.map((sid: string) => {
                  const student = mockStudents.find(s => s.id === sid);
                  return (
                    <div key={sid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                      <span style={{ fontWeight: '500' }}>{student?.name}</span>
                      <span style={{ color: 'var(--muted)' }}>Grade {student?.grade}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder for more batches */}
        <div style={{ 
          border: '2px dashed var(--card-border)', 
          borderRadius: 'var(--radius)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--muted)',
          fontSize: '0.875rem'
        }}>
          No more batches assigned
        </div>
      </div>
    </div>
  );
}
