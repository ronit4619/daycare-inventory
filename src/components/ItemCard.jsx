import React, { useState } from 'react';
import { Minus, Plus, AlertCircle, CheckCircle2, AlertTriangle, Trash2, Pencil, Layers, ChevronDown, ChevronUp, Flame, Zap } from 'lucide-react';
import { getItemSummary, calculateBurnRate } from '../data/mockInitialData';

export default function ItemCard({ item, currentUser, usageLogs = [], onLogUsage, onOpenRestockModal, onEdit, onDelete }) {
  const [showBatchDetails, setShowBatchDetails] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';

  const summary = getItemSummary(item);
  const totalQty = summary.totalQuantity;
  const earliestExp = summary.earliestExpiration;
  const activeBatches = summary.activeBatches;

  const burnRateInfo = calculateBurnRate(item, usageLogs, 7);

  const isLowStock = totalQty <= item.par_level;
  const isCritical = totalQty === 0;

  const unitCost = Number(item.unit_cost) || 0;
  const totalItemValuation = totalQty * unitCost;

  // Target quantity for stock percentage display
  const targetQuantity = Math.max(item.par_level * 1.5, 1);
  const percentage = Math.min(Math.round((totalQty / targetQuantity) * 100), 100);

  // Status Badge Helper
  const getBadgeStyle = () => {
    if (isCritical) {
      return {
        className: 'badge badge-critical',
        icon: <AlertCircle size={12} />,
        label: 'Out of Stock'
      };
    }
    if (isLowStock) {
      return {
        className: 'badge badge-warning',
        icon: <AlertTriangle size={12} />,
        label: `Low Stock (Par: ${item.par_level})`
      };
    }
    return {
      className: 'badge badge-optimal',
      icon: <CheckCircle2 size={12} />,
      label: 'Optimal Stock'
    };
  };

  // Expiration Calculation Helper
  const getExpiryInfo = () => {
    if (!earliestExp) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expDate = new Date(earliestExp);
    expDate.setHours(0, 0, 0, 0);

    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = expDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (diffDays < 0) {
      return {
        isExpired: true,
        className: 'badge badge-expiry-expired',
        label: `⛔ EXPIRED (${Math.abs(diffDays)}d ago)`
      };
    } else if (diffDays === 0) {
      return {
        isExpiringSoon: true,
        className: 'badge badge-expiry-warning',
        label: '⏳ EARLIEST EXPIRES TODAY'
      };
    } else if (diffDays <= 14) {
      return {
        isExpiringSoon: true,
        className: 'badge badge-expiry-warning',
        label: `⏳ Earliest Exp in ${diffDays}d (${formattedDate})`
      };
    } else {
      return {
        className: 'badge badge-expiry-fresh',
        label: `📅 Earliest Exp: ${formattedDate}`
      };
    }
  };

  // Age Group Helper
  const getAgeGroupBadge = () => {
    switch (item.age_group) {
      case 'INFANT':
        return <span className="badge badge-age-infant">🍼 Infant (0-12m)</span>;
      case 'TODDLER':
        return <span className="badge badge-age-toddler">🧸 Toddler (1-3y)</span>;
      case 'PRESCHOOL':
        return <span className="badge badge-age-preschool">🎨 Preschool (3-5y)</span>;
      default:
        return <span className="badge badge-age-all">🌟 All Ages</span>;
    }
  };

  const badge = getBadgeStyle();
  const expiry = getExpiryInfo();
  const isDurable = item.item_type === 'DURABLE';

  return (
    <div className={`glass-card item-card ${isLowStock ? 'is-low-stock' : ''}`}>
      {/* Header Info */}
      <div className="item-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="item-category-tag">{item.category}</span>
            <span className={isDurable ? 'type-tag-durable' : 'type-tag-consumable'}>
              {isDurable ? '🔁 Durable' : '📦 Consumable'}
            </span>
          </div>
          <h3 className="item-title">{item.name}</h3>
        </div>

        {/* Action icons: Edit & Delete (Admin has full access; Staff has Edit) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <button 
            onClick={() => onEdit(item)} 
            style={{ 
              background: 'rgba(255,255,255,0.06)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)', 
              cursor: 'pointer', 
              padding: '0.35rem 0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Edit Expiration & Item Details"
          >
            <Pencil size={14} color="var(--accent-primary)" />
          </button>

          {/* Delete is Admin-Only */}
          {isAdmin && (
            <button 
              onClick={() => onDelete(item.id)} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-muted)', 
                cursor: 'pointer', 
                padding: '0.35rem 0.45rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Delete Item (Admin Only)"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Badges Row */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span className={badge.className}>
          {badge.icon}
          {badge.label}
        </span>
        {getAgeGroupBadge()}
        {expiry && (
          <span className={expiry.className}>
            {expiry.label}
          </span>
        )}
      </div>

      {/* Quantity & Pricing Display */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="quantity-display">
            <span 
              className="quantity-number" 
              style={{ color: isCritical ? 'var(--accent-red)' : isLowStock ? 'var(--accent-amber)' : 'var(--text-primary)' }}
            >
              {totalQty}
            </span>
            <span className="quantity-unit">{item.unit}</span>
          </div>

          {/* Unit Cost & Total Item Valuation (ADMIN ONLY) */}
          {isAdmin && unitCost > 0 && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-green)', display: 'block' }}>
                ${unitCost.toFixed(2)}<span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>/{item.unit}</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Total: ${totalItemValuation.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
          <span className="par-threshold-text">Par Level: {item.par_level} {item.unit}</span>
          <span className="par-threshold-text">{percentage}% of target</span>
        </div>

        {/* Progress meter bar */}
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${percentage}%`,
              backgroundColor: isCritical ? 'var(--accent-red)' : isLowStock ? 'var(--accent-amber)' : 'var(--accent-green)'
            }} 
          />
        </div>
      </div>

      {/* Burn-Rate Prediction Pill */}
      {!isDurable && burnRateInfo.daysRemaining !== null && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: burnRateInfo.daysRemaining <= 4 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.12)',
          border: `1px solid ${burnRateInfo.daysRemaining <= 4 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.3)'}`,
          color: burnRateInfo.daysRemaining <= 4 ? '#f87171' : '#818cf8',
          padding: '0.35rem 0.65rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.78rem',
          fontWeight: 600
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Zap size={14} color={burnRateInfo.daysRemaining <= 4 ? '#ef4444' : '#6366f1'} />
            {burnRateInfo.daysRemaining <= 0 ? 'Depleted today' : `Runs out in ~${burnRateInfo.daysRemaining} days (${burnRateInfo.runOutDate})`}
          </span>
          <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>
            {burnRateInfo.dailyBurnRate} {item.unit}/day
          </span>
        </div>
      )}

      {/* Batch Expiration Breakdown Toggle */}
      {activeBatches.length > 1 && (
        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.6rem', border: '1px solid var(--glass-border)' }}>
          <button
            onClick={() => setShowBatchDetails(prev => !prev)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Layers size={12} color="var(--accent-primary)" />
              {activeBatches.length} Expiration Batches
            </span>
            {showBatchDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showBatchDetails && (
            <div style={{ marginTop: '0.4rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {activeBatches.map((b, idx) => (
                <div key={b.id || idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Batch #{idx + 1}: {b.quantity} {item.unit}</span>
                  <span style={{ color: b.expiration_date === earliestExp ? 'var(--accent-amber)' : 'var(--text-secondary)', fontWeight: b.expiration_date === earliestExp ? 700 : 400 }}>
                    Exp: {b.expiration_date || 'None'} {b.expiration_date === earliestExp ? '(Earliest)' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="card-actions">
        <button 
          className="btn btn-danger-subtle" 
          onClick={() => {
            if (expiry?.isExpired) {
              if (window.confirm(`⚠️ WARNING: "${item.name}" has EXPIRED! Are you sure you want to log usage of an expired product?`)) {
                onLogUsage(item.id, 1);
              }
            } else {
              onLogUsage(item.id, 1);
            }
          }}
          disabled={totalQty <= 0}
          title={expiry?.isExpired ? 'Item is Expired!' : 'Log 1 unit used'}
        >
          <Minus size={16} />
          <span>-1 Used</span>
        </button>

        <button 
          className="btn btn-success-subtle" 
          onClick={() => onOpenRestockModal(item)}
          title="Restock + Add batch with expiration date"
        >
          <Plus size={16} />
          <span>+ Restock</span>
        </button>
      </div>
    </div>
  );
}
