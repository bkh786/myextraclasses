'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Loader2, CheckCircle, AlertCircle, Calendar, Clock } from 'lucide-react';

interface BatchFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BatchForm({ onSuccess, onCancel }: BatchFormProps) {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [formData, setFormData] = useState({
    class: '',
    subject: '',
    teacher_id: '',
    max_students: 5,
    fee_per_student: '',
    teacher_payout: '',
    start_date: new Date().toISOString().split('T')[0],
    zoom_link: '',
    days: 'Mon-Wed-Fri'
  });

  useEffect(() => {
    async function fetchTeachers() {
      const { data } = await supabase.from('teachers').select('*');
      if (data) setTeachers(data);
    }
    fetchTeachers();
  }, []);

  // Auto calculate end time
  useEffect(() => {
    if (startTime) {
      const [hoursStr, minutesStr] = startTime.split(':');
      let hours = parseInt(hoursStr);
      let minutes = parseInt(minutesStr);

      minutes += 90;
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
      hours = hours % 24;

      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      
      const formatTime12Hour = (h: number, m: number) => {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
      };

      const start12 = formatTime12Hour(parseInt(hoursStr), parseInt(minutesStr));
      const end12 = formatTime12Hour(hours, minutes);

      setEndTime(end12);
    } else {
      setEndTime('');
    }
  }, [startTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_students' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startTime) {
       setError("Please select a start time.");
       return;
    }

    setLoading(true);
    setError(null);

    const [hoursStr, minutesStr] = startTime.split(':');
    const start12 = (() => {
       const h = parseInt(hoursStr);
       const m = parseInt(minutesStr);
       const ampm = h >= 12 ? 'PM' : 'AM';
       const displayH = h % 12 || 12;
       return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
    })();

    const finalTiming = `${formData.days}, ${start12} - ${endTime}`;

    try {
      const selectedTeacher = teachers.find(t => (t.teacher_id || t.id) === formData.teacher_id);
      const tName = selectedTeacher ? selectedTeacher.name.split(' ')[0] : 'Open';
      const autoBatchName = `${tName} | ${start12}`;

      const payload: any = {
        name: autoBatchName,
        class: formData.class,
        subject: formData.subject,
        timing: finalTiming,
        max_students: formData.max_students,
        start_date: formData.start_date
      };

      if (formData.teacher_id) payload.teacher_id = formData.teacher_id;
      if (formData.fee_per_student) payload.fee_per_student = parseFloat(formData.fee_per_student);
      if (formData.teacher_payout) payload.teacher_payout = parseFloat(formData.teacher_payout);
      if (formData.zoom_link) payload.zoom_link = formData.zoom_link;

      const res = await fetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      console.error('Error creating batch:', err);
      setError(err.message || 'Failed to create batch. Please check entry.');
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
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Batch Created!</h3>
        <p style={{ color: '#64748b' }}>Your new batch is now explicitly mapped to the system.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {error && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Class *</label>
          <select name="class" required className="input" style={{ width: '100%' }} value={formData.class} onChange={handleChange}>
             <option value="" disabled>Select Class</option>
             {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map(c => (
               <option key={c} value={c}>{c}</option>
             ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Subject *</label>
          <select name="subject" required className="input" style={{ width: '100%' }} value={formData.subject} onChange={handleChange}>
             <option value="" disabled>Select Subject</option>
             {['All Subjects', 'English', 'Hindi', 'Maths', 'SST', 'Science'].map(s => (
               <option key={s} value={s}>{s}</option>
             ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Assigned Teacher</label>
          <select name="teacher_id" className="input" style={{ width: '100%' }} value={formData.teacher_id} onChange={handleChange}>
            <option value="">Select Teacher (Optional)</option>
            {teachers.map(t => (
              <option key={t.teacher_id || t.id} value={t.teacher_id || t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Days</label>
          <div style={{ position: 'relative' }}>
            <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" name="days" required placeholder="e.g. Mon-Wed-Fri" className="input" style={{ paddingLeft: '2.5rem' }} value={formData.days} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Start Time *</label>
          <div style={{ position: 'relative' }}>
            <Clock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="time" 
              required 
              className="input" 
              style={{ paddingLeft: '2.5rem' }} 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
            />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>End Time (Auto: +90 mins)</label>
          <div style={{ position: 'relative' }}>
            <Clock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              className="input" 
              style={{ paddingLeft: '2.5rem', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} 
              value={endTime} 
              disabled 
              readOnly
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Start Date *</label>
          <input type="date" name="start_date" required className="input" value={formData.start_date} onChange={handleChange} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Max Students</label>
          <input 
            type="number" 
            name="max_students" 
            className="input" 
            value={formData.max_students}
            disabled 
            readOnly 
            style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Fee per Student (₹)</label>
          <input type="number" name="fee_per_student" className="input" placeholder="e.g. 3000" value={formData.fee_per_student} onChange={handleChange} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Teacher Payout (₹)</label>
          <input type="number" name="teacher_payout" className="input" placeholder="e.g. 5000" value={formData.teacher_payout} onChange={handleChange} />
        </div>
        <div className="col-span-2">
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Zoom / Meet Link</label>
          <input type="url" name="zoom_link" className="input" placeholder="https://zoom.us/j/..." value={formData.zoom_link} onChange={handleChange} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Launch Batch'}
        </button>
      </div>
    </form>
  );
}
