'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import ActionModal from '@/components/common/ActionModal';
import LeadForm from '@/components/forms/LeadForm';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Fetched leads data:', data);
      if (error) {
        console.error('Supabase error fetching leads:', error);
        throw error;
      }
      setLeads(data || []);
    } catch (err: any) {
      console.error('Error in fetchLeads:', err);
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => 
    (lead.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (lead.subjects?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Converted': return { bg: '#ecfdf5', text: '#059669', icon: CheckCircle2 };
      case 'New': return { bg: '#eff6ff', text: '#2563eb', icon: Clock };
      case 'Demo Scheduled': return { bg: '#fff7ed', text: '#d97706', icon: Calendar };
      case 'Demo Completed': return { bg: '#fdf4ff', text: '#9333ea', icon: CheckCircle2 };
      case 'Lost': return { bg: '#fef2f2', text: '#dc2626', icon: XCircle };
      default: return { bg: '#f1f5f9', text: '#64748b', icon: Clock };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Lead Management</h1>
          <p style={{ color: 'var(--muted)' }}>Manage and track student enquiries from Supabase</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchLeads} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            Add New Lead
          </button>
        </div>
      </div>

      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Lead"
        description="Fill in the details below to record a new student enquiry."
      >
        <LeadForm 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchLeads();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </ActionModal>

      <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            type="text" 
            placeholder="Search leads by name or subject..." 
            className="input" 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', height: '40vh', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 className="animate-spin" size={32} color="var(--primary)" />
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Contact Info</th>
                <th>Class / Subjects</th>
                <th>Status</th>
                <th>Created On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? filteredLeads.map((lead) => {
                const status = getStatusColor(lead.conversion_status);
                const StatusIcon = status.icon;
                return (
                  <tr key={lead.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{lead.student_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Source: {lead.source || 'N/A'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <Phone size={14} color="var(--muted)" /> {lead.phone || 'No phone'}
                      </div>
                      {lead.parent_name && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Parent: {lead.parent_name}</div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>{lead.class} - {lead.subjects}</div>
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
                        backgroundColor: status.bg,
                        color: status.text,
                      }}>
                        <StatusIcon size={14} />
                        {lead.conversion_status}
                      </div>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                          <Mail size={16} />
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
