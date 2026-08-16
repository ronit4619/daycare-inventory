import React from 'react';
import { DollarSign, Package, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { getItemSummary } from '../data/mockInitialData';

export default function InventoryMetricsBar({ items, enrolledChildrenCount = 12 }) {
  // Compute Total Inventory Valuation
  const totalValuation = items.reduce((sum, item) => {
    const summary = getItemSummary(item);
    const cost = Number(item.unit_cost) || 0;
    return sum + (summary.totalQuantity * cost);
  }, 0);

  // Compute Total Restock Cost Needed to bring low-stock items back to par level
  const restockCostNeeded = items.reduce((sum, item) => {
    const summary = getItemSummary(item);
    if (summary.totalQuantity < item.par_level) {
      const deficit = item.par_level - summary.totalQuantity;
      const cost = Number(item.unit_cost) || 0;
      return sum + (deficit * cost);
    }
    return sum;
  }, 0);

  // Total Units in Stock
  const totalUnits = items.reduce((sum, item) => {
    return sum + getItemSummary(item).totalQuantity;
  }, 0);

  // Estimated Cost per Child / Week (Estimate based on weekly consumable inventory replenishment)
  const estCostPerChildWeek = (totalValuation * 0.18 / Math.max(enrolledChildrenCount, 1));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      {/* 1. Total Stock Valuation */}
      <div className="glass-card" style={{ padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(16, 185, 129, 0.15)',
          color: 'var(--accent-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <DollarSign size={22} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Inventory Value
          </span>
          <h4 style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            ${totalValuation.toFixed(2)}
          </h4>
        </div>
      </div>

      {/* 2. Total Units in Stock */}
      <div className="glass-card" style={{ padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(99, 102, 241, 0.15)',
          color: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Package size={22} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Stock on Hand
          </span>
          <h4 style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {totalUnits} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>units</span>
          </h4>
        </div>
      </div>

      {/* 3. Restock Budget Needed */}
      <div className="glass-card" style={{ padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(245, 158, 11, 0.15)',
          color: 'var(--accent-amber)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertTriangle size={22} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Restock Budget
          </span>
          <h4 style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: restockCostNeeded > 0 ? 'var(--accent-amber)' : 'var(--text-primary)', lineHeight: 1.1 }}>
            ${restockCostNeeded.toFixed(2)}
          </h4>
        </div>
      </div>

      {/* 4. Est. Cost Per Child / Week */}
      <div className="glass-card" style={{ padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(6, 182, 212, 0.15)',
          color: 'var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Users size={22} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Est. Cost / Child / Wk
          </span>
          <h4 style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            ${estCostPerChildWeek.toFixed(2)}
          </h4>
        </div>
      </div>
    </div>
  );
}
