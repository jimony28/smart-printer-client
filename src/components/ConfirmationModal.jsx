import React from 'react';

function ConfirmationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4">Order Confirmation</h3>
        <p>We have received your print order!</p>
        <p className="mt-2">You will receive an email once your print is done.</p>
        <button
          onClick={onClose}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ConfirmationModal;