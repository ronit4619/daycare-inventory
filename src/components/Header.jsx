import React, { useState, useEffect } from 'react';
import { Baby, Plus, AlertTriangle, Moon, Sun, ClipboardList, FolderCog, Camera, TrendingUp, Menu, X, Layers } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll listener: Hide header when scrolling DOWN on mobile, show when scrolling UP
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Only trigger scroll-hide on mobile/tablet widths (< 860px) and when scrolled past top 40px
          if (window.innerWidth <= 860) {
            if (currentScrollY > 60 && currentScrollY > lastScrollY) {
              // Scrolling down -> hide header and close mobile menu
              setIsHeaderHidden(true);
              setIsMobileMenuOpen(false);
            } else if (currentScrollY < lastScrollY || currentScrollY <= 40) {
              // Scrolling up or at very top -> reveal header
              setIsHeaderHidden(false);
            }
          } else {
            setIsHeaderHidden(false);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`navbar ${isHeaderHidden ? 'navbar-hidden' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="brand-logo">
          <div className="brand-icon">
            <Baby size={22} />
          </div>
          <div>
            <span className="brand-title">KiddyStock</span>
            <span className="brand-subtitle">
              DAYCARE INVENTORY
            </span>
          </div>
        </div>

        {/* Mobile Quick Header Actions (Only on small screens) */}
        <div className="mobile-header-actions">
          {/* Quick Scan Icon Button */}
          <button 
            className="mobile-icon-btn mobile-icon-btn-accent"
            onClick={onOpenBarcodeScanner}
            title="Scan Barcode"
          >
            <Camera size={19} />
          </button>

          {/* Quick Add Item Button */}
          <button 
            className="mobile-icon-btn mobile-icon-btn-primary"
            onClick={onOpenAddItem}
            title="Add Item"
          >
            <Plus size={19} />
          </button>

          {/* User Profile Pill (Compact) */}
          <button 
            className="mobile-user-pill" 
            onClick={onOpenAuthModal}
            title="Switch User / Role"
          >
            <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>{currentUser?.avatar || '👩‍💼'}</span>
            <span className="mobile-user-role-badge" style={{ background: isAdmin ? '#f59e0b' : '#06b6d4' }}>
              {isAdmin ? 'ADMIN' : 'STAFF'}
            </span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Desktop Navigation Links & Controls (Visible on screens > 860px) */}
        <div className="desktop-nav-controls">
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
            <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>
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

          {/* Camera Barcode Scanner */}
          <button 
            className="btn btn-secondary" 
            onClick={onOpenBarcodeScanner}
            style={{ border: '1px solid var(--accent-primary)', background: 'var(--accent-glow)', color: 'var(--text-primary)' }}
            title="Scan barcode with camera"
          >
            <Camera size={18} color="var(--accent-primary)" />
            <span>Scan Barcode</span>
          </button>

          {/* Quick Log */}
          <button className="btn btn-secondary" onClick={onOpenQuickLog}>
            <ClipboardList size={18} />
            <span>Quick Log</span>
          </button>

          {/* Low Stock Alert Chip */}
          {lowStockCount > 0 && (
            <button 
              className={`btn ${showOnlyLowStock ? 'btn-danger-subtle' : 'btn-secondary'}`}
              onClick={toggleLowStockFilter}
              title="Filter items below par level"
            >
              <AlertTriangle size={18} color="var(--accent-amber)" />
              <span>{showOnlyLowStock ? 'Show All' : 'Low Stock'}</span>
              <span className="alert-count-chip">{lowStockCount}</span>
            </button>
          )}

          {/* Admin Analytics */}
          {isAdmin && (
            <button className="btn btn-secondary" onClick={onOpenAnalytics} title="View Burn Rate & Usage Forecasts">
              <TrendingUp size={18} color="var(--accent-cyan)" />
              <span>Analytics</span>
            </button>
          )}

          {/* Admin Categories */}
          {isAdmin && (
            <button className="btn btn-secondary" onClick={onOpenCategoryManager} title="Manage Supply Categories">
              <FolderCog size={18} />
              <span>Categories</span>
            </button>
          )}

          {/* Add Item Button */}
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

      {/* Mobile Collapsible Drawer Menu (Slides down when hamburger is tapped) */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-menu">
          <div className="mobile-drawer-grid">
            <button 
              className="btn btn-secondary mobile-drawer-btn" 
              onClick={() => {
                onOpenQuickLog();
                setIsMobileMenuOpen(false);
              }}
            >
              <ClipboardList size={18} color="var(--accent-primary)" />
              <span>Staff Quick Log</span>
            </button>

            {lowStockCount > 0 && (
              <button 
                className={`btn ${showOnlyLowStock ? 'btn-danger-subtle' : 'btn-secondary'} mobile-drawer-btn`}
                onClick={() => {
                  toggleLowStockFilter();
                  setIsMobileMenuOpen(false);
                }}
              >
                <AlertTriangle size={18} color="var(--accent-amber)" />
                <span>{showOnlyLowStock ? 'Show All Items' : `Low Stock (${lowStockCount})`}</span>
              </button>
            )}

            {isAdmin && (
              <button 
                className="btn btn-secondary mobile-drawer-btn" 
                onClick={() => {
                  onOpenAnalytics();
                  setIsMobileMenuOpen(false);
                }}
              >
                <TrendingUp size={18} color="var(--accent-cyan)" />
                <span>Usage & Cost Analytics</span>
              </button>
            )}

            {isAdmin && (
              <button 
                className="btn btn-secondary mobile-drawer-btn" 
                onClick={() => {
                  onOpenCategoryManager();
                  setIsMobileMenuOpen(false);
                }}
              >
                <FolderCog size={18} color="#a855f7" />
                <span>Manage Categories</span>
              </button>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button 
                className="btn btn-secondary mobile-drawer-btn" 
                style={{ flex: 1 }}
                onClick={() => {
                  onOpenAuthModal();
                  setIsMobileMenuOpen(false);
                }}
              >
                <span>Switch Role ({currentUser?.role})</span>
              </button>

              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => {
                  toggleTheme();
                }}
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
