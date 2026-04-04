'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  BookOpen, 
  Clock, 
  Calendar, 
  Video, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import ActionModal from '@/components/common/ActionModal';
import BatchForm from '@/components/forms/BatchForm';

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      // Fetch batches with teacher names linked
      const { data, error } = await supabase
        .from('batches')
        .select(`
          *,
          teachers (
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBatches(data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Batch Management</h1>
          <p style={{ color: 'var(--muted)' }}>Create, assign teachers, and manage batch schedules in Supabase</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchBatches} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            Create New Batch
          </button>
        </div>
      </div>

      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Batch"
        description="Schedule a new batch and assign a faculty member."
      >
        <BatchForm 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchBatches();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </ActionModal>

      {loading ? (
        <div style={{ display: 'flex', height: '40vh', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 className="animate-spin" size={32} color="var(--primary)" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {batches.length > 0 ? batches.map((batch) => {
            const studentCount = batch.batch_students?.[0]?.count || 0;
            const fillRate = (studentCount / (batch.max_students || 20)) * 100;
            
            return (
              <div className="card" key={batch.batch_id} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontWeight: '700', fontSize: '1.125rem' }}>{batch.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{batch.subject} - {batch.class}</p>
                  </div>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '6px', 
                    fontSize: '0.75rem',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    fontWeight: '600'
                  }}>
                    Active
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <Users size={18} color="var(--muted)" />
                    <span>{studentCount} / {batch.max_students || 20} Students</span>
                  </div>
                  <div style={{ padding: '0.25rem 0', width: '100%' }}>
                    <div style={{ height: '6px', backgroundColor: 'var(--secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${fillRate}%`, height: '100%', backgroundColor: 'var(--primary)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <ShieldCheck size={18} color="var(--muted)" />
                    <span>Teacher: <strong>{batch.teachers?.name || 'Unassigned'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <Clock size={14} color="var(--muted)" />
                    <span>Timing: {batch.timing || 'TBD'}</span>
                  </div>
                  {batch.zoom_link && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                      <Video size={14} color="#2563eb" />
                      <a href={batch.zoom_link} target="_blank" style={{ color: '#2563eb', fontWeight: '500' }}>Zoom Class Link</a>
                    </div>
                  )}
                </div>

                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '1rem', 
                  backgroundColor: 'var(--secondary)', 
                  borderRadius: '8px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <div>
                    <p style={{ fontSize: '0.625rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Fees/Student</p>
                    <p style={{ fontWeight: '700' }}>₹{batch.fee_per_student || 0}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.625rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Payout/Batch</p>
                    <p style={{ fontWeight: '700' }}>₹{batch.teacher_payout || 0}</p>
                  </div>
                </div>

                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Batch Details
                  <ChevronRight size={16} />
                </button>
              </div>
            );
          }) : (
            <div className="card" style={{ gridColumn: 'span 3', textAlign: 'center', padding: '3rem' }}>
              <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--muted)' }} />
              <p style={{ fontWeight: '600' }}>No active batches found in Supabase.</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem', marginInline: 'auto' }}>
                Create Your First Batch
              </button>
            </div>
          )}

          {/* Add Batch Placeholder Card */}
          {batches.length > 0 && (
            <div 
              onClick={() => setIsModalOpen(true)}
              style={{ 
                border: '2px dashed var(--card-border)', 
                borderRadius: 'var(--radius)', 
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                color: 'var(--muted)',
                cursor: 'pointer'
              }}
            >
              <div style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: '50%' }}>
                <Plus size={32} />
              </div>
              <p style={{ fontWeight: '600' }}>Create New Batch</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
