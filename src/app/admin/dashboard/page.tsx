'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Briefcase,
  PieChart as PieChartIcon,
  CheckCircle2,
  Loader2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart, 
  Area,
  XAxis,
  YAxis
} from 'recharts';
import { useAdminStats, useRevenueTrends } from '@/hooks/use-admin-stats';
import ActionModal from '@/components/common/ActionModal';
import LeadForm from '@/components/forms/LeadForm';
import StudentForm from '@/components/forms/StudentForm';
import TeacherForm from '@/components/forms/TeacherForm';
import BatchForm from '@/components/forms/BatchForm';

const StatCard = ({ title, value, subValue, growth, icon: Icon, color }: any) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ 
        padding: '0.625rem', 
        backgroundColor: `${color}15`, 
        color: color, 
        borderRadius: '10px' 
      }}>
        <Icon size={20} />
      </div>
      {growth !== undefined && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontSize: '0.75rem', 
          fontWeight: '600',
          color: growth >= 0 ? '#10b981' : '#ef4444',
          backgroundColor: growth >= 0 ? '#10b98115' : '#ef444415',
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          {growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(growth)}%
        </div>
      )}
    </div>
    <div>
      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '500' }}>{title}</p>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '0.25rem' }}>{value}</h3>
      {subValue && <p style={{ fontSize: '0.625rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{subValue}</p>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { stats, loading: statsLoading, refresh } = useAdminStats(selectedMonth, selectedYear);
  const { trends, loading: trendsLoading } = useRevenueTrends();

  // Modal State
  type ModalType = 'lead' | 'student' | 'teacher' | 'batch' | null;
  const [modalType, setModalType] = useState<ModalType>(null);

  const conversionData = stats ? [
    { name: 'Converted', value: stats.total_converted_students, color: '#10b981' },
    { name: 'Pending', value: Math.max(0, stats.total_leads - stats.total_converted_students), color: '#6366f1' },
  ] : [];

  const handleSuccess = () => {
    setModalType(null);
    refresh();
  };

  const renderModal = () => {
    if (!modalType) return null;

    const modalConfig = {
      lead: { title: 'Add New Lead', desc: 'Capture a fresh enquiry.', component: LeadForm },
      student: { title: 'Enroll Student', desc: 'Onboard a new student.', component: StudentForm },
      teacher: { title: 'Hire Teacher', desc: 'Add a new faculty member.', component: TeacherForm },
      batch: { title: 'Create Batch', desc: 'Schedule a new academic group.', component: BatchForm }
    };

    const config = modalConfig[modalType];
    const FormComponent = config.component;

    return (
      <ActionModal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        title={config.title}
        description={config.desc}
      >
        <FormComponent 
          onSuccess={handleSuccess}
          onCancel={() => setModalType(null)}
        />
      </ActionModal>
    );
  };

  if (statsLoading || trendsLoading) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        <p style={{ color: 'var(--muted)', fontWeight: '500' }}>Syncing with Intelligence Hub...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {renderModal()}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Admin Core</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.25rem' }}>Business Overview & Academic Performance Analytics</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select 
            className="input" 
            style={{ width: '120px', height: '40px' }} 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, idx) => (
              <option key={m} value={idx + 1}>{m}</option>
            ))}
          </select>
          <select 
            className="input" 
            style={{ width: '100px', height: '40px' }} 
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {['2024', '2025', '2026', '2027'].map(y => (
              <option key={y} value={parseInt(y)}>{y}</option>
            ))}
          </select>
          <button 
            onClick={() => setModalType('lead')}
            className="btn btn-primary" 
            style={{ boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
          >
            <Plus size={18} />
            Quick Add Lead
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats?.total_leads} growth={12} icon={UserPlus} color="#6366f1" />
        <StatCard title="Demo Scheduled" value={stats?.demo_scheduled_count} subValue={`${stats?.demo_completed_count} Completed`} icon={Clock} color="#f59e0b" />
        <StatCard title="Conversion" value={`${stats?.conversion_rate}%`} growth={5} icon={TrendingUp} color="#10b981" />
        <StatCard title="Active Students" value={stats?.active_students} subValue={`Total: ${stats?.total_converted_students}`} icon={Users} color="#06b6d4" />

        <StatCard title="Total Teachers" value={stats?.total_teachers} icon={Briefcase} color="#ec4899" />
        <StatCard title="Active Batches" value={stats?.total_batches} icon={Briefcase} color="#f97316" />
        <StatCard title="Monthly Revenue" value={`₹${stats?.monthly_revenue.toLocaleString()}`} growth={18} icon={DollarSign} color="#10b981" />
        <StatCard title="Pending Fees" value={`₹${stats?.total_pending_fees.toLocaleString()}`} icon={AlertCircle} color="#ef4444" />

        <StatCard title="Batch Fill Rate" value={`${stats?.batch_fill_rate}%`} icon={PieChartIcon} color="#6366f1" />
        <StatCard title="Payout Liability" value={`₹${stats?.total_teacher_payout_liability.toLocaleString()}`} icon={CreditCard} color="#8b5cf6" />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Add New Lead', icon: UserPlus, color: '#6366f1', type: 'lead' },
          { label: 'Create Batch', icon: Calendar, color: '#f59e0b', type: 'batch' },
          { label: 'Enroll Student', icon: Users, color: '#10b981', type: 'student' },
          { label: 'Hire Teacher', icon: Plus, color: '#ec4899', type: 'teacher' },
        ].map((action, i) => (
          <button 
            key={i} 
            onClick={() => setModalType(action.type as ModalType)}
            className="card" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              cursor: 'pointer',
              border: '1px solid var(--card-border)',
              transition: 'transform 0.2s, border-color 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = action.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--card-border)';
            }}
          >
            <div style={{ 
              padding: '0.5rem', 
              backgroundColor: `${action.color}15`, 
              color: action.color, 
              borderRadius: '8px' 
            }}>
              <action.icon size={20} />
            </div>
            <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>{action.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Revenue Trends</h3>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Lead Status</h3>
          <div style={{ height: '320px', width: '100%', position: 'relative' }}>
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={conversionData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value">
                  {conversionData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
