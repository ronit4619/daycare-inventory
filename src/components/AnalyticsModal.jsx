import React, { useState } from 'react';
import { X, TrendingUp, Zap, Clock, DollarSign, Calendar, AlertTriangle, ArrowRight, History } from 'lucide-react';
import { getItemSummary, calculateBurnRate } from '../data/mockInitialData';

export default function AnalyticsModal({ isOpen, onClose, items, usageLogs = [] }) {
  const [activeTab, setActiveTab] = useState('forecast'); // forecast | history

  if (!isOpen) return null;

  // Calculate items forecasting data
  const forecastData = items
    .filter(i => i.item_type === 'CONSUMABLE')
    .map(item => {
      const summary = getItemSummary(item);
      const burn = calculateBurnRate(item, usageLogs, 7);
      const unitCost = Number(item.unit_cost) || 0;
      const weeklyCost = burn.dailyBurnRate * 7 * unitCost;

      return {
        item,
        totalQty: summary.totalQuantity,
        burn,
        weeklyCost
      };
    })
    .sort((a, b) => {
      // Sort items running out soonest first
      if (a.burn.daysRemaining === null) return 1;
      if (b.burn.daysRemaining === null) return -1;
      return a.burn.daysRemaining - b.burn.daysRemaining;
    });

  // Calculate total weekly consumption spend
  const totalWeeklySpend = forecastData.reduce((sum, f) => sum + f.weeklyCost, 0);

  // Count items running out in < 5 days
  const urgentRunOutCount = forecastData.filter(f => f.burn.daysRemaining !== null && f.burn.daysRemaining <= 4).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px', maxHeight: '88vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={24} color="var(--accent-primary)" />
            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 700 }}>
                Usage Rates & Burn-Rate Analytics
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Based on rolling 7-day usage history
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Top Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {/* Urgent Run Out */}
          <div style={{ background: 'var(--bg-primary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Depleting Soon (&lt;5d)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <Zap size={20} color={urgentRunOutCount > 0 ? '#ef4444' : '#10b981'} />
              <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: urgentRunOutCount > 0 ? '#f87171' : 'var(--text-primary)' }}>
                {urgentRunOutCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>items</span>
              </h4>
            </div>
          </div>

          {/* Weekly Consumption Cost */}
          <div style={{ background: 'var(--bg-primary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Est. Weekly Usage Cost
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <DollarSign size={20} color="var(--accent-green)" />
              <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-green)' }}>
                ${totalWeeklySpend.toFixed(2)}
              </h4>
            </div>
          </div>

          {/* Total Usage Events */}
          <div style={{ background: 'var(--bg-primary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Logs Recorded
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <History size={20} color="var(--accent-cyan)" />
              <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {usageLogs.length}
              </h4>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          <button
            className={`btn ${activeTab === 'forecast' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('forecast')}
          >
            <Zap size={14} />
            <span>Run-Out Forecast Table</span>
          </button>

          <button
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('history')}
          >
            <History size={14} />
            <span>Recent Usage Logs ({usageLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: Burn-Rate Forecast Table */}
        {activeTab === 'forecast' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Supply Item</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Stock</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Daily Burn</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Estimated Run-Out</th>
                  <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>Est. Weekly Cost</th>
                </tr>
              </thead>
              <tbody>
                {forecastData.map(({ item, totalQty, burn, weeklyCost }) => {
                  const isUrgent = burn.daysRemaining !== null && burn.daysRemaining <= 4;
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.category}</span>
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>
                        {totalQty} {item.unit}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-secondary)' }}>
                        {burn.dailyBurnRate > 0 ? `${burn.dailyBurnRate} ${item.unit}/day` : 'No recent usage'}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        {burn.daysRemaining !== null ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: isUrgent ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                            color: isUrgent ? '#f87171' : '#818cf8',
                            border: `1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.3)'}`
                          }}>
                            <Clock size={12} />
                            {burn.daysRemaining <= 0 ? 'Out of Stock' : `~${burn.daysRemaining} days (${burn.runOutDate})`}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>--</span>
                        )}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent-green)' }}>
                        ${weeklyCost.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Recent Usage Logs Feed */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '360px', overflowY: 'auto' }}>
            {usageLogs.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No usage logs recorded yet.</p>
            ) : (
              usageLogs.slice().reverse().map(log => {
                const logDate = new Date(log.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                return (
                  <div 
                    key={log.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-primary)',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--glass-border)'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {log.item_name}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        <span>Logged by {log.user_role || 'Staff'} • {logDate}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-red)', fontSize: '0.95rem' }}>
                        -{log.quantity_used} used
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
