'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/context/auth-context';
import { Plus, Link as LinkIcon, Calendar, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import ActionModal from '@/components/common/ActionModal';

export default function TeacherAssessmentsPage() {
  const { user } = useAuth();
  const [batches, setBatches] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [title, setTitle] = useState('');
  const [formLink, setFormLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      // Fetch batches assigned to teacher
      const { data: bData } = await supabase.from('batches').select('*').eq('teacher_id', user.id);
      if (bData) setBatches(bData);

      // Fetch assessments created by teacher
      const { data: aData } = await supabase
        .from('assessments')
        .select('*, batches(name, subject, class)')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });
      if (aData) setAssessments(aData);
      
      setLoading(false);
    }
    loadData();
  }, [user]);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedBatch || !title || !formLink) return;

    setIsSubmitting(true);
    await supabase.from('assessments').insert([{
      batch_id: selectedBatch,
      teacher_id: user.id,
      title,
      google_form_link: formLink
    }]);

    setIsSubmitting(false);
    setIsModalOpen(false);
    setTitle('');
    setFormLink('');
    
    // Refresh
    const { data: aData } = await supabase
      .from('assessments')
      .select('*, batches(name, subject, class)')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false });
    if (aData) setAssessments(aData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Manage Assessments</h1>
          <p style={{ color: 'var(--muted)' }}>Distribute external assessment links (e.g. Google Forms) to your batches.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Run New Assessment
        </button>
      </div>

      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Distribute New Assessment"
        description="Select a batch and provide the Google Form link which students will use to test."
      >
        <form onSubmit={handleCreateAssessment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Select Batch</label>
            <select 
              className="input" 
              required
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">-- Choose Batch --</option>
              {batches.map(b => (
                <option key={b.batch_id} value={b.batch_id}>{b.name} ({b.subject} - {b.class})</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Assessment Title</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Monthly Term 1 Physics Test"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Google Form Link</label>
            <input 
              type="url" 
              className="input" 
              placeholder="https://docs.google.com/forms/d/e/..."
              required
              value={formLink}
              onChange={(e) => setFormLink(e.target.value)}
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Distribute Assessment'}
          </button>
        </form>
      </ActionModal>

      <div className="card" style={{ padding: '0' }}>
         <div className="table-container">
           {loading ? (
             <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={24} style={{ margin: '0 auto' }} /></div>
           ) : (
             <table>
               <thead>
                 <tr>
                   <th>Assessment Title</th>
                   <th>Target Batch</th>
                   <th>External Link</th>
                   <th>Published Date</th>
                   <th>Action</th>
                 </tr>
               </thead>
               <tbody>
                 {assessments.map(a => (
                   <tr key={a.id}>
                     <td style={{ fontWeight: '600' }}>{a.title}</td>
                     <td>
                       <div style={{ fontWeight: '500' }}>{a.batches?.name}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{a.batches?.subject}</div>
                     </td>
                     <td>
                       <a href={a.google_form_link} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontSize: '0.875rem', fontWeight: '500' }}>
                         <LinkIcon size={14} /> Open Form
                       </a>
                     </td>
                     <td>{new Date(a.created_at).toLocaleDateString()}</td>
                     <td>
                       <button onClick={() => window.location.href = '/teacher/performance'} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                          Enter Grades <ArrowRight size={14} />
                       </button>
                     </td>
                   </tr>
                 ))}
                 {assessments.length === 0 && (
                   <tr>
                     <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                       No assessments have been created yet.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           )}
         </div>
      </div>
    </div>
  );
}
