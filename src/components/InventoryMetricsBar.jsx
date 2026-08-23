import React from 'react';
import { DollarSign, Package, AlertTriangle, Users } from 'lucide-react';
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
    <div className="metrics-bar-grid">
      {/* 1. Total Stock Valuation */}
      <div className="glass-card metric-card">
        <div className="metric-icon-box metric-icon-green">
          <DollarSign size={20} />
        </div>
        <div className="metric-info">
          <span className="metric-label">
            Inventory Value
          </span>
          <h4 className="metric-value">
            ${totalValuation.toFixed(2)}
          </h4>
        </div>
      </div>

      {/* 2. Total Units in Stock */}
      <div className="glass-card metric-card">
        <div className="metric-icon-box metric-icon-primary">
          <Package size={20} />
        </div>
        <div className="metric-info">
          <span className="metric-label">
            Stock on Hand
          </span>
          <h4 className="metric-value">
            {totalUnits} <span className="metric-subtext">units</span>
          </h4>
        </div>
      </div>

      {/* 3. Restock Budget Needed */}
      <div className="glass-card metric-card">
        <div className="metric-icon-box metric-icon-amber">
          <AlertTriangle size={20} />
        </div>
        <div className="metric-info">
          <span className="metric-label">
            Restock Budget
          </span>
          <h4 className="metric-value" style={{ color: restockCostNeeded > 0 ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
            ${restockCostNeeded.toFixed(2)}
          </h4>
        </div>
      </div>

      {/* 4. Est. Cost Per Child / Week */}
      <div className="glass-card metric-card">
        <div className="metric-icon-box metric-icon-cyan">
          <Users size={20} />
        </div>
        <div className="metric-info">
          <span className="metric-label">
            Est. / Child / Wk
          </span>
          <h4 className="metric-value">
            ${estCostPerChildWeek.toFixed(2)}
          </h4>
        </div>
      </div>
    </div>
  );
}
