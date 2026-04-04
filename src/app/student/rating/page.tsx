'use client';

import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

export default function StudentRatingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Teacher Rating</h1>
        <p style={{ color: 'var(--muted)' }}>Submit feedback for your assigned classes to help us improve.</p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
            R
          </div>
          <div>
            <h3 style={{ fontWeight: '600' }}>Rahul Sharma</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Mathematics • Grade 10 Batch</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontWeight: '600' }}>Rate your experience</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} style={{ color: '#cbd5e1' }}>
                <Star size={32} />
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Additional Feedback</label>
          <div style={{ position: 'relative' }}>
            <MessageSquare size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--muted)' }} />
            <textarea 
              className="input" 
              placeholder="Tell us what you like or what can be improved..."
              rows={4}
              style={{ paddingLeft: '2.5rem', resize: 'vertical' }}
            />
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
          Submit Rating
        </button>
      </div>
    </div>
  );
}
