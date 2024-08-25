import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Confirm Modal"
            className="confirm-modal"
            overlayClassName="confirm-modal-overlay"
        >
            <h2>Confirm Action</h2>
            <p>{message}</p>
            <div className="modal-actions">
                <button onClick={onConfirm} className="btn btn-danger">Confirm</button>
                <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;