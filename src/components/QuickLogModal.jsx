import React, { useState } from 'react';
import { X, ClipboardList, Minus, Check, Filter } from 'lucide-react';

export default function QuickLogModal({ isOpen, onClose, items, onLogUsage }) {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [amount, setAmount] = useState(1);
  const [ageGroupFilter, setAgeGroupFilter] = useState('ALL');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const filteredItems = items.filter(item => {
    if (ageGroupFilter === 'ALL') return true;
    return item.age_group === ageGroupFilter || item.age_group === 'ALL';
  });

  const handleLog = (e) => {
    e.preventDefault();
    if (!selectedItemId) return;

    onLogUsage(selectedItemId, Number(amount));
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 900);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={22} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 600 }}>
              Staff Quick-Log Usage
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {successMsg ? (
          <div style={{ padding: '2rem', textAlign: 'center', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ width: '56px', height: '56px', background: 'var(--accent-green-bg)', color: 'var(--accent-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Check size={32} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Usage Logged Successfully!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Quantity updated in system</p>
          </div>
        ) : (
          <form onSubmit={handleLog}>
            {/* Age Room Filter Pill Toggle */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Filter Room / Age Group:
              </label>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Rooms' },
                  { id: 'INFANT', label: '🍼 Infant' },
                  { id: 'TODDLER', label: '🧸 Toddler' },
                  { id: 'PRESCHOOL', label: '🎨 Preschool' }
                ].map(grp => (
                  <button
                    key={grp.id}
                    type="button"
                    className={`btn ${ageGroupFilter === grp.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                    onClick={() => {
                      setAgeGroupFilter(grp.id);
                      setSelectedItemId('');
                    }}
                  >
                    {grp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Item Dropdown */}
            <div className="form-group">
              <label>Select Item Used</label>
              <select 
                className="form-control"
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
                required
              >
                <option value="">-- Choose Daycare Supply Item --</option>
                {filteredItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.current_quantity} {item.unit} remaining)
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Buttons */}
            <div className="form-group">
              <label>Quantity Used</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {[1, 2, 3, 5].map(preset => (
                  <button 
                    key={preset}
                    type="button" 
                    className={`btn ${amount === preset ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setAmount(preset)}
                  >
                    -{preset}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={!selectedItemId}>
                <Minus size={16} />
                <span>Log Usage</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
