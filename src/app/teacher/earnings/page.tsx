'use client';

import React from 'react';
import { CreditCard, Wallet, Calendar } from 'lucide-react';

export default function TeacherEarningsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Earnings Overview</h1>
        <p style={{ color: 'var(--muted)' }}>Track your monthly payouts and batch revenue splits.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '50%' }}>
            <Wallet size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: '500' }}>This Month</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹0.00</div>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--muted)' }}>
        <CreditCard size={48} color="#cbd5e1" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--foreground)' }}>No Transaction History</h3>
        <p>Your payouts will appear here after the first settlement cycle.</p>
      </div>
    </div>
  );
}
