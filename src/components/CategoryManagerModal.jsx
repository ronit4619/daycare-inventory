import React, { useState } from 'react';
import { X, FolderPlus, Trash2, Tag } from 'lucide-react';

export default function CategoryManagerModal({ isOpen, onClose, categories, onAddCategory, onDeleteCategory }) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newIcon, setNewIcon] = useState('📦');
  const [newColor, setNewColor] = useState('#6366f1');

  if (!isOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    onAddCategory({
      id: `cat_${Date.now()}`,
      name: newCategoryName.trim(),
      icon: newIcon,
      color: newColor
    });

    setNewCategoryName('');
  };

  const icons = ['📦', '👶', '🍼', '🧸', '🧼', '🎨', '🍎', '🧩', '🧻', '🩹', '🍼', '🍌'];
  const colors = ['#6366f1', '#10b981', '#a855f7', '#06b6d4', '#ec4899', '#f59e0b', '#ef4444', '#3b82f6'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderPlus size={22} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 600 }}>
              Manage Supply Categories
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Existing Categories List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
            Current Categories
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
            {categories.map(cat => (
              <div 
                key={cat.id || cat.name}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{cat.icon || '📦'}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{cat.name}</span>
                </div>
                {categories.length > 1 && (
                  <button 
                    onClick={() => onDeleteCategory(cat.id || cat.name)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add New Category Form */}
        <form onSubmit={handleCreate} style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.8rem' }}>
            Add Custom Category
          </h4>

          <div className="form-group">
            <label>Category Name</label>
            <input 
              type="text"
              className="form-control"
              placeholder="e.g. Bedding & Naptime, Outdoor Play"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* Icon picker */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Icon Emoji
              </label>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {icons.slice(0, 8).map(ico => (
                  <button
                    key={ico}
                    type="button"
                    style={{
                      background: newIcon === ico ? 'var(--accent-glow)' : 'var(--bg-primary)',
                      border: newIcon === ico ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.25rem 0.4rem',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                    onClick={() => setNewIcon(ico)}
                  >
                    {ico}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Theme Color
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {colors.map(col => (
                  <button
                    key={col}
                    type="button"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: col,
                      border: newColor === col ? '2px solid white' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setNewColor(col)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="btn btn-primary" disabled={!newCategoryName.trim()}>
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
