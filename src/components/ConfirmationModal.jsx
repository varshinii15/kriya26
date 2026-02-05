import React from "react";

const ConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="absolute inset-0 top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-black bg-opacity-50">
      <div className="flex-col items-center justify-center p-6 text-black bg-white rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold">Confirm Registration</h2>
        <p className="mt-2 text-sm">Are you sure you want to register?</p>
        <div className="flex mt-4 space-x-3 ">
          <button
            className="px-4 py-2 text-black bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
