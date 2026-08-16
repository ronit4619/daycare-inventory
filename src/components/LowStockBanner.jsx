import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function LowStockBanner({ lowStockItems, onFilterClick }) {
  if (!lowStockItems || lowStockItems.length === 0) return null;

  return (
    <div className="alert-banner">
      <div className="alert-banner-content">
        <AlertTriangle size={22} color="var(--accent-amber)" />
        <div>
          <span>Attention needed: </span>
          <span style={{ color: 'var(--text-primary)' }}>
            {lowStockItems.length} supply {lowStockItems.length === 1 ? 'item is' : 'items are'} below minimum par level
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 400 }}>
            {lowStockItems.map(item => item.name).join(' • ')}
          </span>
        </div>
      </div>

      <button className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }} onClick={onFilterClick}>
        <span>View Low Stock</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
