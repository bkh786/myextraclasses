'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Loader2, CheckCircle, AlertCircle, User } from 'lucide-react';

interface StudentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'];
const SUBJECT_OPTIONS = ['English', 'Hindi', 'Maths', 'SST', 'Science'];

export default function StudentForm({ onSuccess, onCancel }: StudentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    class: '',
    mode: 'Offline',
    monthly_fee: '',
    status: 'Active',
    join_date: new Date().toISOString().split('T')[0]
  });

  // Watch class changes to update subjects
  useEffect(() => {
    if (!formData.class) {
      setSelectedSubjects([]);
      return;
    }

    const classNum = parseInt(formData.class.replace('Class ', ''));
    if (classNum >= 1 && classNum <= 5) {
      setSelectedSubjects(['All Subjects']);
    } else {
      if (selectedSubjects.includes('All Subjects')) {
         setSelectedSubjects([]);
      }
    }
  }, [formData.class]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subject)) {
        return prev.filter(s => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.class || selectedSubjects.length === 0 || !formData.join_date) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('students')
        .insert([
          {
            name: formData.name,
            class: formData.class,
            subjects: selectedSubjects.join(', '),
            mode: formData.mode,
            status: formData.status,
            monthly_fee: formData.monthly_fee ? parseFloat(formData.monthly_fee) : null,
            join_date: formData.join_date
          }
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      console.error('Error enrolling student:', err);
      setError(err.message || 'Failed to enroll student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isPrimary = formData.class ? parseInt(formData.class.replace('Class ', '')) <= 5 : false;

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#ecfdf5',
          color: '#10b981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <CheckCircle size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Student Enrolled!</h3>
        <p style={{ color: '#64748b' }}>Registration successfully completed for {formData.name}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#fef2f2',
          color: '#ef4444',
          borderRadius: '8px',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: '1px solid #fee2e2'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={16} /> Student Information
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Full Name *</label>
            <input type="text" name="name" required className="input" placeholder="e.g. Ravi Sharma" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Class / Grade *</label>
            <select name="class" required className="input" style={{ width: '100%' }} value={formData.class} onChange={handleChange}>
               <option value="" disabled>Select Class</option>
               {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
             <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Subjects *</label>
             {isPrimary ? (
               <input type="text" className="input" disabled value="All Subjects" style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} />
             ) : formData.class ? (
               <div style={{ position: 'relative' }}>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', padding: '0.25rem', border: '1px solid var(--input-border)', borderRadius: 'var(--radius)', minHeight: '38px' }}>
                    {SUBJECT_OPTIONS.map(subject => (
                      <label key={subject} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer', padding: '0.125rem 0.25rem', backgroundColor: selectedSubjects.includes(subject) ? '#e0e7ff' : 'transparent', borderRadius: '4px' }}>
                         <input type="checkbox" checked={selectedSubjects.includes(subject)} onChange={() => handleSubjectToggle(subject)} style={{ display: 'none' }} />
                         {subject}
                      </label>
                    ))}
                 </div>
               </div>
             ) : (
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0.5rem 0' }}>Select a class first</div>
             )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Join Date *</label>
            <input type="date" name="join_date" required className="input" value={formData.join_date} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Monthly Fee (₹)</label>
            <input type="number" name="monthly_fee" className="input" placeholder="e.g. 3000" value={formData.monthly_fee} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Mode</label>
            <select name="mode" className="input" style={{ width: '100%' }} value={formData.mode} onChange={handleChange}>
              <option value="Offline">Offline</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Status</label>
            <select name="status" className="input" style={{ width: '100%' }} value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Enroll Now'}
        </button>
      </div>
    </form>
  );
}
