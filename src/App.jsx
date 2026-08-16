import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Search, RefreshCw, AlertTriangle, Layers, CheckCircle, Clock, ShieldAlert, ArrowUpDown, Camera, TrendingUp, UserCheck } from 'lucide-react';
import { initialItems, initialCategories, initialOrganization, initialUsageLogs, initialUsers, getItemSummary, calculateBurnRate } from './data/mockInitialData';
import Header from './components/Header';
import AlertsBanner from './components/AlertsBanner';
import InventoryMetricsBar from './components/InventoryMetricsBar';
import ItemCard from './components/ItemCard';
import AddItemModal from './components/AddItemModal';
import EditItemModal from './components/EditItemModal';
import RestockModal from './components/RestockModal';
import QuickLogModal from './components/QuickLogModal';
import CategoryManagerModal from './components/CategoryManagerModal';
import BarcodeScannerModal from './components/BarcodeScannerModal';
import AnalyticsModal from './components/AnalyticsModal';
import AuthModal from './components/AuthModal';

export default function App() {
  // Users & Auth State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('kiddystock_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kiddystock_current_user');
    return saved ? JSON.parse(saved) : initialUsers[0]; // Default to Sarah Jenkins (ADMIN)
  });

  // Items, Categories & UsageLogs State with localStorage persistence
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('kiddystock_items');
    return saved ? JSON.parse(saved) : initialItems;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('kiddystock_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [usageLogs, setUsageLogs] = useState(() => {
    const saved = localStorage.getItem('kiddystock_usage_logs');
    return saved ? JSON.parse(saved) : initialUsageLogs;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kiddystock_theme') || 'dark';
  });

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);
  const [showOnlyExpiring, setShowOnlyExpiring] = useState(false);
  const [sortOrder, setSortOrder] = useState('DEFAULT'); // DEFAULT | RUNOUT_SOONEST | EXPIRING_SOONEST | QTY_LOWEST

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockItem, setRestockItem] = useState(null);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [pendingBarcodeForNewItem, setPendingBarcodeForNewItem] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kiddystock_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('kiddystock_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kiddystock_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('kiddystock_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('kiddystock_usage_logs', JSON.stringify(usageLogs));
  }, [usageLogs]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kiddystock_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Expiration & Low Stock Calculators
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lowStockItems = items.filter(item => {
    const summary = getItemSummary(item);
    return summary.totalQuantity <= item.par_level;
  });

  const expiredItems = items.filter(item => {
    const summary = getItemSummary(item);
    if (!summary.earliestExpiration) return false;
    const exp = new Date(summary.earliestExpiration);
    exp.setHours(0, 0, 0, 0);
    return exp < today;
  });

  const expiringItems = items.filter(item => {
    const summary = getItemSummary(item);
    if (!summary.earliestExpiration) return false;
    const exp = new Date(summary.earliestExpiration);
    exp.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 14;
  });

  // FIFO Usage Decrement Handler + Usage Log Recording
  const handleLogUsage = (itemId, amount = 1) => {
    const targetItem = items.find(i => i.id === itemId);
    if (!targetItem) return;

    // Record usage log entry with current user name
    const newLog = {
      id: `log_${Date.now()}`,
      item_id: itemId,
      item_name: targetItem.name,
      quantity_used: amount,
      logged_at: new Date().toISOString(),
      user_role: currentUser.role,
      user_name: currentUser.full_name
    };

    setUsageLogs(prev => [newLog, ...prev]);

    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          let remainingToDeduct = amount;
          let updatedBatches = (item.batches || []).map(b => ({ ...b }));

          // Sort batches so earliest expiring (non-empty) batch is deducted first (FIFO)
          updatedBatches.sort((a, b) => {
            if (!a.expiration_date) return 1;
            if (!b.expiration_date) return -1;
            return new Date(a.expiration_date) - new Date(b.expiration_date);
          });

          for (let b of updatedBatches) {
            if (remainingToDeduct <= 0) break;
            if (b.quantity > 0) {
              const deduct = Math.min(b.quantity, remainingToDeduct);
              b.quantity -= deduct;
              remainingToDeduct -= deduct;
            }
          }

          const summary = getItemSummary({ ...item, batches: updatedBatches });
          const newQty = summary.totalQuantity;

          if (newQty <= item.par_level && item.current_quantity > item.par_level) {
            showToast(`⚠️ Alert: ${item.name} dropped below par level (${item.par_level} ${item.unit})`, 'warning');
          } else {
            showToast(`Logged -${amount} ${item.unit} for ${item.name}`, 'success');
          }

          return { 
            ...item, 
            batches: updatedBatches,
            current_quantity: newQty,
            expiration_date: summary.earliestExpiration
          };
        }
        return item;
      })
    );
  };

  // Restock Handler with New Expiration Batch
  const handleRestockWithBatch = (itemId, addedQty, newBatchExpiry) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const wasLow = (getItemSummary(item).totalQuantity <= item.par_level);
          const existingBatches = item.batches || [];
          
          let newBatches = [...existingBatches];
          const existingSameExpIndex = newBatches.findIndex(b => b.expiration_date === newBatchExpiry);

          if (existingSameExpIndex !== -1) {
            newBatches[existingSameExpIndex] = {
              ...newBatches[existingSameExpIndex],
              quantity: newBatches[existingSameExpIndex].quantity + addedQty
            };
          } else {
            newBatches.push({
              id: `b_${Date.now()}`,
              quantity: addedQty,
              expiration_date: newBatchExpiry
            });
          }

          const summary = getItemSummary({ ...item, batches: newBatches });
          const newQty = summary.totalQuantity;

          if (wasLow && newQty > item.par_level) {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
            showToast(`🎉 Restocked +${addedQty}! ${item.name} is now optimal. Earliest exp: ${summary.earliestExpiration || 'None'}`, 'success');
          } else {
            showToast(`Restocked +${addedQty} ${item.unit} to ${item.name}`, 'info');
          }

          return {
            ...item,
            batches: newBatches,
            current_quantity: newQty,
            expiration_date: summary.earliestExpiration
          };
        }
        return item;
      })
    );
  };

  const handleOpenRestockModal = (item) => {
    setRestockItem(item);
    setIsRestockModalOpen(true);
  };

  const handleAddItem = (newItemData) => {
    const newBatch = {
      id: `b_${Date.now()}`,
      quantity: Number(newItemData.current_quantity),
      expiration_date: newItemData.expiration_date || null
    };

    const newItem = {
      ...newItemData,
      id: `item_${Date.now()}`,
      organization_id: initialOrganization.id,
      batches: [newBatch],
      created_at: new Date().toISOString()
    };

    setItems(prev => [newItem, ...prev]);
    setPendingBarcodeForNewItem('');
    showToast(`Added ${newItem.name} to inventory`, 'success');
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsEditItemOpen(true);
  };

  const handleUpdateItem = (itemId, updatedData) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const updatedBatches = (item.batches && item.batches.length > 0)
            ? item.batches.map((b, idx) => idx === 0 ? { ...b, expiration_date: updatedData.expiration_date } : b)
            : [{ id: 'b1', quantity: updatedData.current_quantity, expiration_date: updatedData.expiration_date }];

          return { ...item, ...updatedData, batches: updatedBatches };
        }
        return item;
      })
    );
    showToast(`Updated "${updatedData.name}" details & cost`, 'success');
  };

  const handleDeleteItem = (itemId) => {
    const target = items.find(i => i.id === itemId);
    if (target && window.confirm(`Are you sure you want to delete "${target.name}"?`)) {
      setItems(prev => prev.filter(item => item.id !== itemId));
      showToast(`Deleted ${target.name}`, 'info');
    }
  };

  const handleAddNewWithBarcode = (barcode) => {
    setPendingBarcodeForNewItem(barcode);
    setIsAddItemOpen(true);
  };

  // Category Handlers
  const handleAddCategory = (newCat) => {
    setCategories(prev => [...prev, newCat]);
    showToast(`Created category "${newCat.name}"`, 'success');
  };

  const handleDeleteCategory = (catIdOrName) => {
    setCategories(prev => prev.filter(c => c.id !== catIdOrName && c.name !== catIdOrName));
    showToast('Category deleted', 'info');
  };

  // User Handlers
  const handleSelectUser = (user) => {
    setCurrentUser(user);
    showToast(`Switched profile to ${user.full_name} (${user.role})`, 'info');
  };

  const handleAddUser = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleResetData = () => {
    if (window.confirm("Reset all inventory items, categories, users, and usage logs back to demo data?")) {
      setItems(initialItems);
      setCategories(initialCategories);
      setUsageLogs(initialUsageLogs);
      setUsers(initialUsers);
      setCurrentUser(initialUsers[0]);
      localStorage.removeItem('kiddystock_items');
      localStorage.removeItem('kiddystock_categories');
      localStorage.removeItem('kiddystock_usage_logs');
      localStorage.removeItem('kiddystock_users');
      localStorage.removeItem('kiddystock_current_user');
      showToast("Reset to initial dataset", "info");
    }
  };

  // Filtering & Sorting Logic
  let filteredItems = items.filter(item => {
    const summary = getItemSummary(item);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.barcode && item.barcode.includes(searchQuery));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesAgeGroup = selectedAgeGroup === 'ALL' || item.age_group === selectedAgeGroup || item.age_group === 'ALL';
    const matchesItemType = selectedTypeFilter === 'ALL' || item.item_type === selectedTypeFilter;
    const matchesLowStock = !showOnlyLowStock || summary.totalQuantity <= item.par_level;

    const matchesExpiring = !showOnlyExpiring || (() => {
      if (!summary.earliestExpiration) return false;
      const exp = new Date(summary.earliestExpiration);
      exp.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 14;
    })();

    return matchesSearch && matchesCategory && matchesAgeGroup && matchesItemType && matchesLowStock && matchesExpiring;
  });

  // Sorting
  if (sortOrder === 'EXPIRING_SOONEST') {
    filteredItems.sort((a, b) => {
      const expA = getItemSummary(a).earliestExpiration;
      const expB = getItemSummary(b).earliestExpiration;
      if (!expA) return 1;
      if (!expB) return -1;
      return new Date(expA) - new Date(expB);
    });
  } else if (sortOrder === 'QTY_LOWEST') {
    filteredItems.sort((a, b) => getItemSummary(a).totalQuantity - getItemSummary(b).totalQuantity);
  } else if (sortOrder === 'RUNOUT_SOONEST') {
    filteredItems.sort((a, b) => {
      const burnA = calculateBurnRate(a, usageLogs, 7).daysRemaining;
      const burnB = calculateBurnRate(b, usageLogs, 7).daysRemaining;
      if (burnA === null) return 1;
      if (burnB === null) return -1;
      return burnA - burnB;
    });
  }

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="app-shell">
      {/* Navbar Header with Role Switcher */}
      <Header 
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        lowStockCount={lowStockItems.length}
        onOpenAddItem={() => {
          setPendingBarcodeForNewItem('');
          setIsAddItemOpen(true);
        }}
        onOpenQuickLog={() => setIsQuickLogOpen(true)}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        onOpenBarcodeScanner={() => setIsBarcodeScannerOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        showOnlyLowStock={showOnlyLowStock}
        toggleLowStockFilter={() => {
          setShowOnlyLowStock(prev => !prev);
          setShowOnlyExpiring(false);
        }}
      />

      <main className="main-content">
        {/* Toast Alert Popup */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 1000,
            background: toastMessage.type === 'warning' ? '#241a08' : toastMessage.type === 'success' ? '#08251b' : '#131b2e',
            color: toastMessage.type === 'warning' ? '#f59e0b' : toastMessage.type === 'success' ? '#10b981' : '#818cf8',
            border: `1.5px solid ${toastMessage.type === 'warning' ? '#f59e0b' : toastMessage.type === 'success' ? '#10b981' : '#6366f1'}`,
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 600,
            fontSize: '0.92rem',
            animation: 'slideDown 0.2s ease-out'
          }}>
            {toastMessage.type === 'warning' && <AlertTriangle size={20} color="#f59e0b" />}
            {toastMessage.type === 'success' && <CheckCircle size={20} color="#10b981" />}
            {toastMessage.type === 'info' && <CheckCircle size={20} color="#818cf8" />}
            <span>{toastMessage.message}</span>
          </div>
        )}

        {/* Combined Urgent Alerts Banner */}
        <AlertsBanner 
          lowStockItems={lowStockItems}
          expiringItems={expiringItems}
          expiredItems={expiredItems}
          onFilterLowStock={() => {
            setShowOnlyLowStock(true);
            setShowOnlyExpiring(false);
          }}
          onFilterExpiring={() => {
            setShowOnlyExpiring(true);
            setShowOnlyLowStock(false);
          }}
        />

        {/* ADMIN ONLY: Financial & Inventory Metrics Bar */}
        {isAdmin && <InventoryMetricsBar items={items} enrolledChildrenCount={12} />}

        {/* Filter Bar 1: Search & Room Filters */}
        <div className="controls-bar" style={{ marginBottom: '1rem' }}>
          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text"
              placeholder="Search name, category, or barcode..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Age Group Filter Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.2rem' }}>
              Age Room:
            </span>
            {[
              { id: 'ALL', label: '🌟 All' },
              { id: 'INFANT', label: '🍼 Infant' },
              { id: 'TODDLER', label: '🧸 Toddler' },
              { id: 'PRESCHOOL', label: '🎨 Preschool' }
            ].map(grp => (
              <button
                key={grp.id}
                className={`btn ${selectedAgeGroup === grp.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                onClick={() => setSelectedAgeGroup(grp.id)}
              >
                {grp.label}
              </button>
            ))}
          </div>

          {/* Special Quick Filters: Expiration Watch Button */}
          <button 
            className={`btn ${showOnlyExpiring ? 'btn-danger-subtle' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => {
              setShowOnlyExpiring(prev => !prev);
              setShowOnlyLowStock(false);
            }}
          >
            <Clock size={16} color={showOnlyExpiring ? 'var(--accent-red)' : 'var(--accent-amber)'} />
            <span>Expiring / Expired</span>
            {(expiringItems.length > 0 || expiredItems.length > 0) && (
              <span className="alert-count-chip" style={{ background: expiredItems.length > 0 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
                {expiredItems.length + expiringItems.length}
              </span>
            )}
          </button>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={14} color="var(--text-muted)" />
            <select 
              className="form-control"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="DEFAULT">Sort: Default</option>
              <option value="RUNOUT_SOONEST">⚡ Sort: Running Out Soonest</option>
              <option value="EXPIRING_SOONEST">📅 Sort: Earliest Expiry (FIFO)</option>
              <option value="QTY_LOWEST">📦 Sort: Lowest Quantity</option>
            </select>
          </div>
        </div>

        {/* Filter Bar 2: Categories Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.2rem' }}>
            Category:
          </span>
          <button
            className={`btn ${selectedCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => setSelectedCategory('All')}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id || cat.name}
              className={`btn ${selectedCategory === cat.name ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
          
          {/* Admin category management shortcut */}
          {isAdmin && (
            <button 
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', color: 'var(--accent-primary)' }}
              onClick={() => setIsCategoryManagerOpen(true)}
              title="Manage Categories"
            >
              <span>Manage</span>
            </button>
          )}

          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}
            onClick={handleResetData}
            title="Reset dataset"
          >
            <RefreshCw size={14} />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', margin: '2rem 0' }}>
            <Layers size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Supply Items Match Your Filters</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {showOnlyExpiring ? 'Great news! No supplies are currently expiring or expired.' : showOnlyLowStock ? 'Great news! No items are below par level.' : 'Try adjusting your search query or filter.'}
            </p>
            <button className="btn btn-primary" onClick={() => setIsAddItemOpen(true)}>
              Add Supply Item
            </button>
          </div>
        ) : (
          <div className="items-grid">
            {filteredItems.map(item => (
              <ItemCard 
                key={item.id}
                item={item}
                currentUser={currentUser}
                usageLogs={usageLogs}
                onLogUsage={handleLogUsage}
                onOpenRestockModal={handleOpenRestockModal}
                onEdit={() => handleOpenEdit(item)}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        users={users}
        onSelectUser={handleSelectUser}
        onAddUser={handleAddUser}
      />

      <AddItemModal 
        isOpen={isAddItemOpen}
        onClose={() => {
          setIsAddItemOpen(false);
          setPendingBarcodeForNewItem('');
        }}
        onAddItem={handleAddItem}
        categories={categories}
        initialBarcode={pendingBarcodeForNewItem}
      />

      <EditItemModal 
        isOpen={isEditItemOpen}
        onClose={() => {
          setIsEditItemOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onUpdateItem={handleUpdateItem}
        categories={categories}
      />

      <RestockModal 
        isOpen={isRestockModalOpen}
        onClose={() => {
          setIsRestockModalOpen(false);
          setRestockItem(null);
        }}
        item={restockItem}
        onRestockWithBatch={handleRestockWithBatch}
      />

      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        items={items}
        usageLogs={usageLogs}
      />

      <QuickLogModal 
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        items={items}
        onLogUsage={handleLogUsage}
      />

      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <BarcodeScannerModal 
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        items={items}
        onLogUsage={handleLogUsage}
        onRestock={(itemId, amt) => {
          const target = items.find(i => i.id === itemId);
          if (target) handleOpenRestockModal(target);
        }}
        onAddNewWithBarcode={handleAddNewWithBarcode}
      />
    </div>
  );
}
