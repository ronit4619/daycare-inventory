import React, { useState } from 'react';
import { X, UserCheck, Shield, KeyRound, User, Plus, Check } from 'lucide-react';
import { initialUsers } from '../data/mockInitialData';

export default function AuthModal({ isOpen, onClose, currentUser, users = initialUsers, onSelectUser, onAddUser }) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('STAFF');

  if (!isOpen) return null;

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser = {
      id: `user_${Date.now()}`,
      organization_id: "org_daycare_01",
      full_name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      avatar: newUserRole === 'ADMIN' ? '👩‍💼' : '🧸'
    };

    onAddUser(newUser);
    onSelectUser(newUser);
    setIsAddingNew(false);
    setNewUserName('');
    setNewUserEmail('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={22} color="var(--accent-primary)" />
            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 600 }}>
                {isAddingNew ? 'Add Team Member' : 'Switch Active Profile'}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAddingNew ? 'Create a staff or admin account' : 'Select user to test Admin vs Staff permissions'}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {!isAddingNew ? (
          <div>
            {/* User List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {users.map(user => {
                const isCurrent = currentUser?.id === user.id;
                const isAdmin = user.role === 'ADMIN';

                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isCurrent ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-primary)',
                      border: `1.5px solid ${isCurrent ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.6rem' }}>{user.avatar}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                            {user.full_name}
                          </span>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--radius-full)',
                            background: isAdmin ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                            color: isAdmin ? '#f59e0b' : '#06b6d4',
                            border: `1px solid ${isAdmin ? 'rgba(245, 158, 11, 0.4)' : 'rgba(6, 182, 212, 0.4)'}`
                          }}>
                            {isAdmin ? '👑 ADMIN' : '🧸 STAFF'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {user.email}
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Check size={16} />
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Role Permissions Legend */}
            <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 0.35rem', fontWeight: 600, color: 'var(--text-primary)' }}>Role Permissions:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>👑 Admin (Director):</span>
                  <ul style={{ margin: '0.2rem 0 0 1.2rem', padding: 0 }}>
                    <li>View costs & valuations</li>
                    <li>Analytics & Burn rates</li>
                    <li>Add/Edit/Delete supplies</li>
                    <li>Category Manager</li>
                  </ul>
                </div>
                <div>
                  <span style={{ color: '#06b6d4', fontWeight: 700 }}>🧸 Staff (Educator):</span>
                  <ul style={{ margin: '0.2rem 0 0 1.2rem', padding: 0 }}>
                    <li>Quick Usage (-1 Used)</li>
                    <li>Restock supplies</li>
                    <li>Barcode scanning</li>
                    <li>Expiration alerts</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setIsAddingNew(true)}
              >
                <Plus size={16} />
                <span>Add Team Member</span>
              </button>

              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Rachel Green"
                value={newUserName}
                onChange={e => setNewUserName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. rachel@sunshinekids.com"
                value={newUserEmail}
                onChange={e => setNewUserEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Assigned Role</label>
              <select
                className="form-control"
                value={newUserRole}
                onChange={e => setNewUserRole(e.target.value)}
              >
                <option value="STAFF">🧸 STAFF (Room Educator / Babysitter)</option>
                <option value="ADMIN">👑 ADMIN (Director / Daycare Owner)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddingNew(false)}>
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Switch
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
