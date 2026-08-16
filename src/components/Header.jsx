import React from 'react';
import { Baby, Plus, AlertTriangle, Moon, Sun, ClipboardList, FolderCog, Camera, TrendingUp, UserCheck, Shield } from 'lucide-react';

export default function Header({ 
  currentUser,
  onOpenAuthModal,
  lowStockCount, 
  onOpenAddItem, 
  onOpenQuickLog, 
  onOpenCategoryManager,
  onOpenBarcodeScanner,
  onOpenAnalytics,
  theme, 
  toggleTheme,
  showOnlyLowStock,
  toggleLowStockFilter
}) {
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="brand-logo">
          <div className="brand-icon">
            <Baby size={24} />
          </div>
          <div>
            <span>KiddyStock</span>
            <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.5px' }}>
              DAYCARE INVENTORY MANAGER
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* User Profile / Role Switcher Pill */}
          <button 
            className="btn btn-secondary" 
            onClick={onOpenAuthModal}
            style={{ 
              padding: '0.35rem 0.65rem', 
              border: isAdmin ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(6, 182, 212, 0.4)',
              background: isAdmin ? 'rgba(245, 158, 11, 0.1)' : 'rgba(6, 182, 212, 0.1)'
            }}
            title="Switch User / Role"
          >
            <span style={{ fontSize: '1.1rem' }}>{currentUser?.avatar || '👩‍💼'}</span>
            <span className="hide-mobile" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
              {currentUser?.full_name?.split(' ')[0] || 'User'}
            </span>
            <span style={{ 
              fontSize: '0.68rem', 
              fontWeight: 700, 
              padding: '0.1rem 0.35rem', 
              borderRadius: 'var(--radius-full)',
              background: isAdmin ? '#f59e0b' : '#06b6d4',
              color: '#000'
            }}>
              {isAdmin ? 'ADMIN' : 'STAFF'}
            </span>
          </button>

          {/* Camera Barcode Scanner Button (Available to both) */}
          <button 
            className="btn btn-secondary" 
            onClick={onOpenBarcodeScanner}
            style={{ border: '1px solid var(--accent-primary)', background: 'var(--accent-glow)', color: 'var(--text-primary)' }}
            title="Scan barcode with camera"
          >
            <Camera size={18} color="var(--accent-primary)" />
            <span className="hide-mobile">Scan Barcode</span>
          </button>

          {/* Quick Log Button for Staff & Admin */}
          <button className="btn btn-secondary" onClick={onOpenQuickLog}>
            <ClipboardList size={18} />
            <span className="hide-mobile">Quick Log</span>
          </button>

          {/* Low Stock Filter Button */}
          {lowStockCount > 0 && (
            <button 
              className={`btn ${showOnlyLowStock ? 'btn-danger-subtle' : 'btn-secondary'}`}
              onClick={toggleLowStockFilter}
              title="Filter items below par level"
            >
              <AlertTriangle size={18} color="var(--accent-amber)" />
              <span className="hide-mobile">{showOnlyLowStock ? 'Show All' : 'Low Stock'}</span>
              <span className="alert-count-chip">{lowStockCount}</span>
            </button>
          )}

          {/* ADMIN-ONLY FEATURES: Analytics */}
          {isAdmin && (
            <button className="btn btn-secondary" onClick={onOpenAnalytics} title="View Burn Rate & Usage Forecasts">
              <TrendingUp size={18} color="var(--accent-cyan)" />
              <span className="hide-mobile">Analytics</span>
            </button>
          )}

          {/* ADMIN-ONLY FEATURES: Category Manager */}
          {isAdmin && (
            <button className="btn btn-secondary" onClick={onOpenCategoryManager} title="Manage Supply Categories">
              <FolderCog size={18} />
              <span className="hide-mobile">Categories</span>
            </button>
          )}

          {/* Add New Item Button (Admin can create, or staff with permissions) */}
          <button className="btn btn-primary" onClick={onOpenAddItem}>
            <Plus size={18} />
            <span>Add Item</span>
          </button>

          {/* Theme Toggle */}
          <button 
            className="btn btn-secondary" 
            onClick={toggleTheme} 
            style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>
        </div>
      </div>
    </header>
  );
}
