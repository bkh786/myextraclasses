'use client';

import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function TeacherProfilePage() {
  const { user } = useAuth();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>My Profile</h1>
        <p style={{ color: 'var(--muted)' }}>Manage your personal details and account settings.</p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            {user?.name?.charAt(0) || 'T'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{user?.name || 'Teacher Profile'}</h2>
            <p style={{ color: 'var(--muted)' }}>Senior Faculty • Mathematics</p>
          </div>
          <button className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Edit Profile</button>
        </div>

        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontWeight: '500' }}>
              <Mail size={16} color="var(--muted)" /> {user?.email || 'teacher@extraclasses.app'}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase' }}>Phone Number</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontWeight: '500' }}>
              <Phone size={16} color="var(--muted)" /> +91-XXXXXXXXXX
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
