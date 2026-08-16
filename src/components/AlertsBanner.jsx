import React, { useState } from 'react';
import { AlertTriangle, Clock, ArrowRight, ShieldAlert, X } from 'lucide-react';

export default function AlertsBanner({ lowStockItems, expiringItems, expiredItems, onFilterLowStock, onFilterExpiring }) {
  const [dismissedExpired, setDismissedExpired] = useState(false);
  const [dismissedExpiring, setDismissedExpiring] = useState(false);
  const [dismissedLowStock, setDismissedLowStock] = useState(false);

  const hasLowStock = lowStockItems && lowStockItems.length > 0 && !dismissedLowStock;
  const hasExpired = expiredItems && expiredItems.length > 0 && !dismissedExpired;
  const hasExpiring = expiringItems && expiringItems.length > 0 && !dismissedExpiring;

  if (!hasLowStock && !hasExpired && !hasExpiring) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
      {/* EXPIRED Urgent Alert Banner (Critical Red) */}
      {hasExpired && (
        <div className="alert-banner" style={{ background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.25), rgba(185, 28, 28, 0.25))', borderColor: 'rgba(239, 68, 68, 0.6)' }}>
          <div className="alert-banner-content" style={{ color: '#ef4444' }}>
            <ShieldAlert size={22} color="#ef4444" />
            <div>
              <span style={{ fontWeight: 800 }}>CRITICAL EXPIRED SUPPLIES: </span>
              <span style={{ color: 'var(--text-primary)' }}>
                {expiredItems.length} {expiredItems.length === 1 ? 'item has' : 'items have'} expired! Remove immediately.
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 400 }}>
                {expiredItems.map(item => item.name).join(' • ')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-danger-subtle" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }} onClick={onFilterExpiring}>
              <span>View Expired</span>
              <ArrowRight size={14} />
            </button>
            <button 
              onClick={() => setDismissedExpired(true)} 
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.3rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', opacity: 0.8 }}
              title="Dismiss Expired Warning"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* EXPIRING SOON Banner (Amber/Orange) */}
      {hasExpiring && !hasExpired && (
        <div className="alert-banner" style={{ background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))', borderColor: 'rgba(245, 158, 11, 0.5)' }}>
          <div className="alert-banner-content" style={{ color: '#f59e0b' }}>
            <Clock size={22} color="#f59e0b" />
            <div>
              <span>EXPIRATION WATCH: </span>
              <span style={{ color: 'var(--text-primary)' }}>
                {expiringItems.length} {expiringItems.length === 1 ? 'item is' : 'items are'} expiring within 14 days
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 400 }}>
                {expiringItems.map(item => `${item.name} (${item.expiration_date})`).join(' • ')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }} onClick={onFilterExpiring}>
              <span>View Expiring</span>
              <ArrowRight size={14} />
            </button>
            <button 
              onClick={() => setDismissedExpiring(true)} 
              style={{ background: 'none', border: 'none', color: 'var(--accent-amber)', cursor: 'pointer', padding: '0.3rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', opacity: 0.8 }}
              title="Dismiss Expiry Watch Warning"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Low Stock Par Level Banner */}
      {hasLowStock && (
        <div className="alert-banner">
          <div className="alert-banner-content">
            <AlertTriangle size={22} color="var(--accent-amber)" />
            <div>
              <span>LOW STOCK WARNING: </span>
              <span style={{ color: 'var(--text-primary)' }}>
                {lowStockItems.length} supply {lowStockItems.length === 1 ? 'item is' : 'items are'} below set par level
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 400 }}>
                {lowStockItems.map(item => item.name).join(' • ')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }} onClick={onFilterLowStock}>
              <span>View Low Stock</span>
              <ArrowRight size={14} />
            </button>
            <button 
              onClick={() => setDismissedLowStock(true)} 
              style={{ background: 'none', border: 'none', color: 'var(--accent-amber)', cursor: 'pointer', padding: '0.3rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', opacity: 0.8 }}
              title="Dismiss Low Stock Warning"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
