'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MoreVertical, 
  GraduationCap,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import ActionModal from '@/components/common/ActionModal';
import StudentForm from '@/components/forms/StudentForm';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('join_date', { ascending: false });
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Student Management</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.25rem' }}>View and manage all active students at Extra Classes.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchStudents} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            Enroll Student
          </button>
        </div>
      </div>

      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enroll New Student"
        description="Register a new student and link them to their parent/guardian."
      >
        <StudentForm 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchStudents();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </ActionModal>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name, ID or email..." 
              className="input" 
              style={{ paddingLeft: '2.5rem', height: '40px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary" style={{ border: '1px solid var(--card-border)' }}>
            <Filter size={18} />
            Filters
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
             <div style={{ display: 'flex', padding: '4rem', alignItems: 'center', justifyContent: 'center' }}>
               <Loader2 className="animate-spin" size={32} color="var(--primary)" />
             </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--card-border)' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase' }}>Student</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase' }}>Class / Course</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase' }}>Parent Contact</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ textAlign: 'center', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <tr key={student.student_id || student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <GraduationCap size={18} color="var(--primary)" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9375rem' }}>{student.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: '500' }}>{student.class}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{student.subjects}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: '500' }}>{student.mode || 'Offline'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>₹{student.monthly_fee || 'N/A'} / month</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className="badge" style={{ 
                        backgroundColor: student.status === 'Active' ? '#ecfdf5' : '#fef2f2', 
                        color: student.status === 'Active' ? '#047857' : '#991b1b' 
                      }}>
                        {student.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <button className="btn" style={{ padding: '0.25rem', borderRadius: '4px' }}>
                        <MoreVertical size={18} color="var(--muted)" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>
            Connected to real-time database
          </div>
        </div>
      </div>
    </div>
  );
}
