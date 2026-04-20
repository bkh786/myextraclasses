'use client';

import React, { useState } from 'react';
import { Loader2, UserCheck, Mail, Phone, Briefcase, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

interface HiringConfirmationFormProps {
  teacher: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function HiringConfirmationForm({ teacher, onSuccess, onCancel }: HiringConfirmationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [salary, setSalary] = useState(teacher.salary_per_batch?.toString() || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: teacher.email,
          name: teacher.name,
          role: 'TEACHER',
          details: {
            phone: teacher.phone,
            salary_per_batch: salary ? parseFloat(salary) : null
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to hire teacher');

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error('Error hiring teacher:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          backgroundColor: '#f0fdf4', 
          color: '#16a34a', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 1rem' 
        }}>
          <CheckCircle size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Success!</h3>
        <p style={{ color: '#64748b' }}>{teacher.name} has been hired and their account is ready.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Teacher Profile Preview */}
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#f8fafc', 
        borderRadius: '16px', 
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            backgroundColor: '#e0e7ff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#4f46e5'
          }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{teacher.name}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Mail size={14} /> {teacher.email}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Phone</label>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Phone size={14} /> {teacher.phone || 'N/A'}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Subjects</label>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Briefcase size={14} /> {teacher.subjects || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="salary" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>
          Salary per Batch (₹) <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <DollarSign size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            id="salary"
            type="number" 
            required 
            placeholder="e.g. 5000" 
            className="input" 
            style={{ paddingLeft: '2.25rem' }}
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Please confirm the per-batch remuneration for this faculty member.</p>
      </div>

      {error && (
        <div style={{ 
          padding: '0.75rem', 
          backgroundColor: '#fef2f2', 
          color: '#b91c1c', 
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

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn btn-secondary" 
          style={{ flex: 1 }}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ flex: 2, backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          disabled={loading}
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : (
            <>
              <UserCheck size={20} />
              Confirm & Hire
            </>
          )}
        </button>
      </div>
    </form>
  );
}
