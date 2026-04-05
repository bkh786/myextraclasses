'use client';

import React, { useState, useEffect } from 'react';
import { Users, Clock, Upload, GraduationCap, ArrowUpRight, CheckCircle2, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [batches, setBatches] = useState<any[]>([]);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      const { data } = await supabase.from('batches').select('*').eq('teacher_id', user.id);
      if (data) setBatches(data);

      const today = new Date().toISOString().split('T')[0];
      const { data: att } = await supabase
        .from('teacher_attendance')
        .select('*')
        .eq('teacher_id', user.id)
        .eq('date', today)
        .single();
      if (att) setAttendanceMarked(true);
    }
    loadData();
  }, [user]);

  const handleSelfAttendance = async () => {
    if (!user) return;
    setLoadingAction(true);
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('teacher_attendance').insert([{
      teacher_id: user.id,
      date: today,
      status: 'Present'
    }]);
    setAttendanceMarked(true);
    setLoadingAction(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--foreground)' }}>
            Welcome back, {user?.name || 'Teacher'} 👋
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.25rem' }}>Here's what's happening in your classes today.</p>
        </div>
        
        {/* Self Attendance Block */}
        <div className="card" style={{ padding: '1rem', backgroundColor: attendanceMarked ? '#ecfdf5' : 'white', borderColor: attendanceMarked ? '#10b981' : 'var(--card-border)' }}>
          {attendanceMarked ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: '600' }}>
               <CheckCircle2 size={20} /> Marked Present for Today
             </div>
          ) : (
            <button onClick={handleSelfAttendance} disabled={loadingAction} className="btn btn-primary" style={{ backgroundColor: '#10b981', width: '100%' }}>
              {loadingAction ? <Loader2 className="animate-spin" size={18} /> : 'Record Daily Attendance'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* KPI Cards */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted)' }}>Assigned Classes</span>
            <Clock size={18} color="#6366f1" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{batches.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Active via Admin mappings
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Upcoming Classes */}
        <div className="card" style={{ padding: '0' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700' }}>Your Batch Schedule</h2>
          </div>
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {batches.map((batch) => (
              <div key={batch.batch_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '8px' }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>{batch.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Timing: {batch.timing || 'TBD'}</div>
                  </div>
                </div>
                {batch.zoom_link ? (
                  <a href={batch.zoom_link} target="_blank" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>Start Class</a>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>No Link Set</span>
                )}
              </div>
            ))}
            {batches.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>No batches active.</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ padding: '0' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--card-border)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700' }}>Quick Actions</h2>
          </div>
          <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Link href="/teacher/class-update" className="btn btn-secondary" style={{ height: '80px', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              <Upload size={24} color="#6366f1" />
              Class Update
            </Link>
            <Link href="/teacher/performance" className="btn btn-secondary" style={{ height: '80px', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              <GraduationCap size={24} color="#8b5cf6" />
              Assessments (Marks)
            </Link>
            <Link href="/teacher/earnings" className="btn btn-secondary" style={{ height: '80px', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              <TrendingUp size={24} color="#f59e0b" />
              Earnings Setup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
