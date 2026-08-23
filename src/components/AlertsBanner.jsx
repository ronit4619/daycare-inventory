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
    <div className="alerts-container">
      {/* 1. EXPIRED Urgent Alert Banner (Critical Red) */}
      {hasExpired && (
        <div className="alert-banner alert-banner-critical">
          <div className="alert-banner-top">
            <div className="alert-banner-header">
              <ShieldAlert size={20} className="alert-icon" color="#ef4444" />
              <div>
                <span className="alert-title alert-title-red">CRITICAL EXPIRED SUPPLIES</span>
                <span className="alert-subtitle">
                  {expiredItems.length} {expiredItems.length === 1 ? 'item has' : 'items have'} expired! Remove immediately.
                </span>
              </div>
            </div>

            <button 
              onClick={() => setDismissedExpired(true)} 
              className="alert-dismiss-btn"
              title="Dismiss Warning"
            >
              <X size={18} />
            </button>
          </div>

          <div className="alert-items-list">
            {expiredItems.map(item => item.name).join(' • ')}
          </div>

          <div className="alert-banner-actions">
            <button className="btn btn-danger-subtle alert-action-btn" onClick={onFilterExpiring}>
              <span>View Expired Items</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 2. EXPIRING SOON Banner (Amber/Orange) */}
      {hasExpiring && !hasExpired && (
        <div className="alert-banner alert-banner-warning">
          <div className="alert-banner-top">
            <div className="alert-banner-header">
              <Clock size={20} className="alert-icon" color="#f59e0b" />
              <div>
                <span className="alert-title alert-title-amber">EXPIRATION WATCH</span>
                <span className="alert-subtitle">
                  {expiringItems.length} {expiringItems.length === 1 ? 'item is' : 'items are'} expiring within 14 days
                </span>
              </div>
            </div>

            <button 
              onClick={() => setDismissedExpiring(true)} 
              className="alert-dismiss-btn"
              title="Dismiss Warning"
            >
              <X size={18} />
            </button>
          </div>

          <div className="alert-items-list">
            {expiringItems.map(item => `${item.name} (${item.expiration_date})`).join(' • ')}
          </div>

          <div className="alert-banner-actions">
            <button className="btn btn-secondary alert-action-btn" onClick={onFilterExpiring}>
              <span>View Expiring Items</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 3. Low Stock Par Level Banner */}
      {hasLowStock && (
        <div className="alert-banner alert-banner-amber">
          <div className="alert-banner-top">
            <div className="alert-banner-header">
              <AlertTriangle size={20} className="alert-icon" color="#f59e0b" />
              <div>
                <span className="alert-title alert-title-amber">LOW STOCK WARNING</span>
                <span className="alert-subtitle">
                  {lowStockItems.length} supply {lowStockItems.length === 1 ? 'item is' : 'items are'} below set par level
                </span>
              </div>
            </div>

            <button 
              onClick={() => setDismissedLowStock(true)} 
              className="alert-dismiss-btn"
              title="Dismiss Warning"
            >
              <X size={18} />
            </button>
          </div>

          <div className="alert-items-list">
            {lowStockItems.map(item => item.name).join(' • ')}
          </div>

          <div className="alert-banner-actions">
            <button className="btn btn-secondary alert-action-btn" onClick={onFilterLowStock}>
              <span>View Low Stock Items</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
