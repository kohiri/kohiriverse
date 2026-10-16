import React from 'react';
import { X, Trash2, Calendar, Eye } from 'lucide-react';
import CardRenderer from './CardRenderer';

export default function SavedCardsDrawer({
  isOpen,
  onClose,
  savedCards = [],
  onSelectCard,
  onDeleteCard
}) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Your Saved ID Collection ({savedCards.length})</h3>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {savedCards.length === 0 ? (
          <div className="empty-collection-message">
            <p>You haven't saved any identity cards yet.</p>
            <p style={{ fontSize: '0.85rem', color: '#A7E8D7' }}>
              Create an ID card and click "Save Card" to keep it in your collection!
            </p>
          </div>
        ) : (
          <div className="saved-cards-list">
            {savedCards.map((card, idx) => (
              <div key={idx} className="saved-card-item">
                <div className="saved-item-info">
                  <h4>{card.name || "Untitled Card"}</h4>
                  <div className="saved-meta">
                    <span>ID: {card.idNumber}</span>
                    <span>• Template #{card.templateId}</span>
                  </div>
                </div>

                <div className="saved-item-actions">
                  <button
                    type="button"
                    className="icon-action-btn view-btn"
                    title="View & Edit"
                    onClick={() => onSelectCard(card)}
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn del-btn"
                    title="Delete"
                    onClick={() => onDeleteCard(idx)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
