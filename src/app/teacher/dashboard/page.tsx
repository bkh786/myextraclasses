'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Clock, 
  TrendingUp,
  CreditCard,
  MessageSquare,
  Loader2,
  CheckCircle2,
  XCircle,
  Save,
  Plus
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useTeacherStats, useTeacherBatches } from '@/hooks/use-teacher-stats';
import { supabase } from '@/lib/supabase-client';

const TeacherStatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ 
      padding: '0.75rem', 
      backgroundColor: `${color}15`, 
      color: color, 
      borderRadius: '12px' 
    }}>
      <Icon size={24} />
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '600' }}>{title}</p>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '0.125rem' }}>{value}</h3>
      {subValue && <p style={{ fontSize: '0.625rem', color: 'var(--muted)', marginTop: '0.125rem' }}>{subValue}</p>}
    </div>
  </div>
);

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useTeacherStats();
  const { batches, loading: batchesLoading } = useTeacherBatches();

  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Fetch students for the active batch
  useEffect(() => {
    if (!activeBatchId) return;

    async function fetchBatchStudents() {
      try {
        setAttendanceLoading(true);
        const { data, error } = await supabase
          .from('batch_students')
          .select(`
            student_id,
            students (
              name,
              class
            )
          `)
          .eq('batch_id', activeBatchId);
        
        if (error) throw error;
        setStudents(data?.map((item: any) => ({
          id: item.student_id,
          name: item.students?.name,
          class: item.students?.class,
          status: 'Present'
        })) || []);
      } catch (err) {
        console.error('Error fetching batch students:', err);
      } finally {
        setAttendanceLoading(false);
      }
    }

    fetchBatchStudents();
  }, [activeBatchId]);

  const handleMarkAttendance = (studentId: string, status: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const saveAttendance = async () => {
    if (!activeBatchId) return;
    alert('Attendance data would be synced with Supabase here!');
  };

  if (statsLoading || batchesLoading) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Teacher Portal</h1>
          <p style={{ color: 'var(--muted)' }}>Monitoring {stats?.batches_assigned} active batches for {user?.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary">
            <Calendar size={18} />
            My Schedule
          </button>
          <button className="btn btn-primary">
            <Plus size={18} />
            Create Test
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-4 gap-4">
        <TeacherStatCard title="My Batches" value={stats?.batches_assigned} icon={BookOpen} color="#6366f1" />
        <TeacherStatCard title="Total Students" value={stats?.total_students_enrolled} icon={Users} color="#10b981" />
        <TeacherStatCard title="Classes This Week" value="--" icon={Calendar} color="#f59e0b" subValue="Next: Today 4 PM" />
        <TeacherStatCard title="Monthly Earnings" value={`₹${stats?.monthly_earnings.toLocaleString()}`} icon={DollarSign} color="#ec4899" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Attendance Marking Module */}
        <div className="card" style={{ gridColumn: 'span 2', padding: 0 }}>
          <div style={{ 
            padding: '1.5rem', 
            borderBottom: '1px solid var(--card-border)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <h3 style={{ fontWeight: '700' }}>Smart Attendance Marker</h3>
            <select 
              className="input" 
              style={{ padding: '0.5rem', width: 'auto', fontSize: '0.875rem' }}
              value={activeBatchId || ''}
              onChange={(e) => setActiveBatchId(e.target.value)}
            >
              <option value="">Select Batch</option>
              {batches.map(b => (
                <option key={b.batch_id} value={b.batch_id}>{b.name}</option>
              ))}
            </select>
          </div>
          
          <div className="table-container" style={{ border: 'none', borderRadius: 0, minHeight: '300px' }}>
            {activeBatchId ? (
              attendanceLoading ? (
                <div style={{ display: 'flex', height: '300px', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 className="animate-spin" size={24} color="var(--primary)" />
                </div>
              ) : (
                <table style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                  <thead>
                    <tr>
                      <th style={{ background: 'transparent' }}>Student Name</th>
                      <th style={{ background: 'transparent' }}>Grade</th>
                      <th style={{ background: 'transparent', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td style={{ fontWeight: '600' }}>{student.name}</td>
                        <td>{student.class}</td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            <button 
                              onClick={() => handleMarkAttendance(student.id, 'Present')}
                              style={{ 
                                padding: '0.5rem 1rem', 
                                border: '1px solid #10b981', 
                                borderRadius: '8px',
                                background: student.status === 'Present' ? '#10b981' : 'transparent',
                                color: student.status === 'Present' ? 'white' : '#10b981',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >P</button>
                            <button 
                              onClick={() => handleMarkAttendance(student.id, 'Absent')}
                              style={{ 
                                padding: '0.5rem 1rem', 
                                border: '1px solid #ef4444', 
                                borderRadius: '8px',
                                background: student.status === 'Absent' ? '#ef4444' : 'transparent',
                                color: student.status === 'Absent' ? 'white' : '#ef4444',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >A</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              <div style={{ display: 'flex', height: '300px', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', flexDirection: 'column', gap: '1rem' }}>
                <CheckSquare size={48} opacity={0.2} />
                <p>Please select a batch to start marking attendance.</p>
              </div>
            )}
          </div>
          {activeBatchId && !attendanceLoading && (
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={saveAttendance}>
                <Save size={18} />
                Save Attendance
              </button>
            </div>
          )}
        </div>

        {/* Quick Marks Entry Module */}
        <div className="card">
          <h3 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Quick Marks Entry</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--muted)' }}>Select Student</label>
              <select className="input">
                <option>Select Student</option>
                {students.map(s => <option key={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--muted)' }}>Test Subject</label>
              <input type="text" className="input" placeholder="e.g. Algebra Quiz" />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--muted)' }}>Marks (%)</label>
              <input type="number" className="input" placeholder="0-100" />
            </div>
            <button className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
              <TrendingUp size={18} />
              Submit Score
            </button>
          </div>
        </div>
      </div>

      {/* Assigned Batches Summary Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
          <h3 style={{ fontWeight: '700' }}>Active Enrollment Summary</h3>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Subject</th>
                <th>Strength</th>
                <th>Timing</th>
                <th>Monthly Payout</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.batch_id}>
                  <td style={{ fontWeight: '600' }}>{batch.name}</td>
                  <td>{batch.subject}</td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '60px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(batch.batch_students?.[0]?.count || 0) / (batch.max_students || 20) * 100}%`, height: '100%', background: 'var(--primary)' }} />
                    </div>
                    {batch.batch_students?.[0]?.count || 0} Students
                  </td>
                  <td>{batch.timing}</td>
                  <td style={{ fontWeight: '700' }}>₹{batch.teacher_payout}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.825rem', fontSize: '0.75rem' }}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Ensure necessary imports
import { DollarSign } from 'lucide-react';
