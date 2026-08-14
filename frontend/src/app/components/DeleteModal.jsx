export default function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Delete this post?</h3>
        <p className="modal-desc">This action is permanent and cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn-confirm-delete" onClick={onConfirm}>Delete</button>
          <button className="btn-modal-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
