import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, PackageCheck } from 'lucide-react';

export default function RestockModal({ isOpen, onClose, item, onRestockWithBatch }) {
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity(1);
      // Default expiration date to 1 month for consumables or blank for non-perishables
      if (item.item_type === 'CONSUMABLE') {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        setExpirationDate(d.toISOString().split('T')[0]);
      } else {
        setExpirationDate('');
      }
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const setQuickExpiry = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setExpirationDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity <= 0) return;

    onRestockWithBatch(item.id, Number(quantity), expirationDate || null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PackageCheck size={22} color="var(--accent-green)" />
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 600 }}>
              Restock: {item.name}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Quantity to Add */}
          <div className="form-group">
            <label>Quantity Adding ({item.unit})</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input 
                type="number"
                min="1"
                className="form-control"
                style={{ flex: 1 }}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                required
              />
              {[1, 2, 5, 10].map(amt => (
                <button 
                  key={amt}
                  type="button"
                  className={`btn ${quantity === amt ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.65rem 0.8rem' }}
                  onClick={() => setQuantity(amt)}
                >
                  +{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Expiration Date of New Batch */}
          <div className="form-group" style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
              <Calendar size={16} color="var(--accent-amber)" />
              <span>New Stock Expiration Date</span>
            </label>
            <input 
              type="date"
              className="form-control"
              style={{ marginTop: '0.3rem' }}
              value={expirationDate}
              onChange={e => setExpirationDate(e.target.value)}
            />

            {/* Quick Expiry Presets */}
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '100%', display: 'block' }}>Presets from today:</span>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setQuickExpiry(7)}>+7 Days</button>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setQuickExpiry(30)}>+1 Month</button>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setQuickExpiry(180)}>+6 Months</button>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setQuickExpiry(365)}>+1 Year</button>
              {expirationDate && (
                <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--accent-red)' }} onClick={() => setExpirationDate('')}>No Expiry</button>
              )}
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            💡 System will automatically track this new batch and display the <strong>Earliest Expiration Date</strong> across all active stock.
          </p>

          {/* Form Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} />
              <span>Add +{quantity} to Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
