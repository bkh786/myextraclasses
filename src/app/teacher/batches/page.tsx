'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/context/auth-context';
import { Users, Clock, Calendar, ChevronRight, CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function TeacherBatchesPage() {
  const { user } = useAuth();
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeacherBatches() {
      if (!user) return;
      try {
        setLoading(true);
        // Using user.id as it maps to teacher_id natively during admin creation
        const { data, error } = await supabase
          .from('batches')
          .select('*, batch_students(count)')
          .eq('teacher_id', user.id);

        if (error) throw error;
        setBatches(data || []);
      } catch (err) {
        console.error('Error fetching teacher batches:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeacherBatches();
  }, [user]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>My Classes</h1>
        <p style={{ color: 'var(--muted)' }}>Select a batch to manage assignments and grades</p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
          <Loader2 className="animate-spin" size={32} color="var(--primary)" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {batches.map((batch) => (
            <div className="card" key={batch.batch_id} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontWeight: '700', fontSize: '1.25rem' }}>{batch.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.875rem' }}>{batch.subject} - {batch.class}</p>
                </div>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--secondary)', borderRadius: '8px' }}>
                  <Users size={20} color="var(--primary)" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Clock size={16} color="var(--muted)" />
                  <span>{batch.timing || 'TBD'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Users size={16} color="var(--muted)" />
                  <span>{batch.batch_students?.[0]?.count || 0} / {batch.max_students || 20} Enrolled</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Calendar size={16} color="var(--muted)" />
                  <span>Since {batch.start_date || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Active Ledger</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/teacher/class-update" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                  Log Class Updates
                </Link>
                <Link href="/teacher/assessments" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                  Run Assessment
                </Link>
              </div>
            </div>
          ))}

          {batches.length === 0 && (
            <div style={{ 
              gridColumn: 'span 2',
              border: '2px dashed var(--card-border)', 
              borderRadius: 'var(--radius)', 
              padding: '3rem',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--muted)',
              fontSize: '0.875rem'
            }}>
              <BookOpen size={32} style={{ marginBottom: '1rem' }} />
              <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>No Active Batches</span>
              <p>You have not been assigned to any upcoming batches by the admin.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
