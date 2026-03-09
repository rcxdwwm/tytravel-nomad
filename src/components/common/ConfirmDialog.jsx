// ConfirmDialog.jsx — Dialogue de confirmation (suppression, etc.)
// Props: isOpen, onConfirm, onCancel, title, message, confirmLabel, danger
import React from 'react'
import Modal from './Modal'
import Button from './Button'
const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title = 'Confirmer', message, confirmLabel = 'Confirmer', danger = false }) => (
  <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
    <p className="text-sm text-[var(--color-text-muted)] mb-5">{message}</p>
    <div className="flex gap-2 justify-end">
      <Button variant="secondary" onClick={onCancel}>Annuler</Button>
      <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
    </div>
  </Modal>
)
export default ConfirmDialog
