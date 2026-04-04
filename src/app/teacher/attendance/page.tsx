'use client';

import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  X, 
  Search,
  Save,
  ArrowLeft
} from 'lucide-react';

const mockBatches: any[] = [{ name: 'Dummy Batch', studentIds: [] }];
const mockStudents: any[] = [];
import { useRouter } from 'next/navigation';

export default function TeacherAttendancePage() {
  const router = useRouter();
  const [selectedBatch, setSelectedBatch] = useState(mockBatches[0]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    mockBatches[0].studentIds.forEach((id: string) => {
      initial[id] = true; // Default all present
    });
    return initial;
  });

  const toggleAttendance = (id: string) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    alert('Attendance saved successfully!');
    router.push('/teacher');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => router.back()} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Mark Attendance</h1>
            <p style={{ color: 'var(--muted)' }}>{selectedBatch.name} - {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <button onClick={handleSave} className="btn btn-primary">
          <Save size={18} />
          Save Attendance
        </button>
      </div>

      <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem 1.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input type="text" placeholder="Search students..." className="input" style={{ paddingLeft: '2.5rem' }} />
        </div>
        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted)' }}>
          Present: {Object.values(attendance).filter(Boolean).length} / {selectedBatch.studentIds.length}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Grade</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedBatch.studentIds.map((sid: string) => {
              const student = mockStudents.find(s => s.id === sid);
                if (!student) return null;
              const isPresent = attendance[sid];
              return (
                <tr key={sid}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{student.name}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>Grade {student.grade}</div>
                  </td>
                  <td>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.375rem',
                      padding: '0.375rem 0.75rem', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: isPresent ? '#ecfdf5' : '#fef2f2',
                      color: isPresent ? '#059669' : '#dc2626',
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isPresent ? '#10b981' : '#ef4444' }} />
                      {isPresent ? 'Present' : 'Absent'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => toggleAttendance(sid)}
                      className={`btn ${isPresent ? 'btn-secondary' : 'btn-primary'}`} 
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.5rem 1rem',
                        backgroundColor: isPresent ? '#fef2f2' : '#ecfdf5',
                        color: isPresent ? '#dc2626' : '#059669',
                        borderColor: isPresent ? '#fecaca' : '#a7f3d0'
                      }}
                    >
                      {isPresent ? 'Mark Absent' : 'Mark Present'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
