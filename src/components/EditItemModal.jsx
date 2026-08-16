import React, { useState, useEffect } from 'react';
import { X, Pencil, Calendar, Barcode, DollarSign } from 'lucide-react';

export default function EditItemModal({ isOpen, onClose, item, onUpdateItem, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    item_type: 'CONSUMABLE',
    age_group: 'ALL',
    unit: 'packs',
    unit_cost: 0,
    current_quantity: 0,
    par_level: 5,
    expiration_date: '',
    barcode: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || categories[0]?.name || 'Diapering & Care',
        item_type: item.item_type || 'CONSUMABLE',
        age_group: item.age_group || 'ALL',
        unit: item.unit || 'packs',
        unit_cost: item.unit_cost ?? 0,
        current_quantity: item.current_quantity ?? 0,
        par_level: item.par_level ?? 5,
        expiration_date: item.expiration_date || '',
        barcode: item.barcode || ''
      });
    }
  }, [item, categories]);

  if (!isOpen || !item) return null;

  const setQuickExpiry = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFormData({ ...formData, expiration_date: d.toISOString().split('T')[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onUpdateItem(item.id, {
      ...formData,
      unit_cost: Number(formData.unit_cost) || 0,
      current_quantity: Number(formData.current_quantity),
      par_level: Number(formData.par_level),
      expiration_date: formData.expiration_date || null
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Pencil size={22} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 600 }}>
              Edit Supply Details
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Item Name */}
          <div className="form-group">
            <label>Item Name *</label>
            <input 
              type="text"
              className="form-control"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Barcode & Cost Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Barcode size={14} color="var(--accent-cyan)" />
                <span>Barcode UPC</span>
              </label>
              <input 
                type="text"
                className="form-control"
                value={formData.barcode}
                onChange={e => setFormData({ ...formData, barcode: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <DollarSign size={14} color="var(--accent-green)" />
                <span>Estimated Cost ($)</span>
              </label>
              <input 
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={formData.unit_cost}
                onChange={e => setFormData({ ...formData, unit_cost: e.target.value })}
              />
            </div>
          </div>

          {/* Expiration Date Section */}
          <div className="form-group" style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
              <Calendar size={16} color="var(--accent-amber)" />
              <span>Expiration Date</span>
            </label>
            <input 
              type="date"
              className="form-control"
              style={{ marginTop: '0.3rem' }}
              value={formData.expiration_date}
              onChange={e => setFormData({ ...formData, expiration_date: e.target.value })}
            />

            {/* Quick Expiry Preset Buttons */}
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '100%', display: 'block' }}>Presets from today:</span>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setQuickExpiry(7)}>+7 Days</button>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setQuickExpiry(30)}>+1 Month</button>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setQuickExpiry(180)}>+6 Months</button>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setQuickExpiry(365)}>+1 Year</button>
              {formData.expiration_date && (
                <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--accent-red)' }} onClick={() => setFormData({ ...formData, expiration_date: '' })}>Clear Expiry</button>
              )}
            </div>
          </div>

          {/* Category & Item Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Category</label>
              <select 
                className="form-control"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Item Type</label>
              <select 
                className="form-control"
                value={formData.item_type}
                onChange={e => setFormData({ ...formData, item_type: e.target.value })}
              >
                <option value="CONSUMABLE">📦 Consumable</option>
                <option value="DURABLE">🔁 Durable (Asset)</option>
              </select>
            </div>
          </div>

          {/* Target Age Group */}
          <div className="form-group">
            <label>Target Age Group</label>
            <select 
              className="form-control"
              value={formData.age_group}
              onChange={e => setFormData({ ...formData, age_group: e.target.value })}
            >
              <option value="ALL">🌟 All Ages (General)</option>
              <option value="INFANT">🍼 Infant (0 - 12m)</option>
              <option value="TODDLER">🧸 Toddler (1 - 3y)</option>
              <option value="PRESCHOOL">🎨 Preschool (3 - 5y)</option>
            </select>
          </div>

          {/* Quantity & Par Level */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Unit</label>
              <select 
                className="form-control"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="packs">packs</option>
                <option value="cans">cans</option>
                <option value="boxes">boxes</option>
                <option value="bottles">bottles</option>
                <option value="count">count</option>
                <option value="rolls">rolls</option>
                <option value="sets">sets</option>
              </select>
            </div>

            <div className="form-group">
              <label>Current Qty</label>
              <input 
                type="number"
                min="0"
                className="form-control"
                value={formData.current_quantity}
                onChange={e => setFormData({ ...formData, current_quantity: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Par Level</label>
              <input 
                type="number"
                min="1"
                className="form-control"
                value={formData.par_level}
                onChange={e => setFormData({ ...formData, par_level: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Form Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
