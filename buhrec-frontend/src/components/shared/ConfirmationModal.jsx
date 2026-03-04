import React from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, type }) => {
  if (!isOpen) return null;

  const isDecline = type === 'decline';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white rounded-[2rem] p-10 w-full max-w-lg shadow-2xl text-center"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute right-8 top-8 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-4">
            You are about to {isDecline ? 'decline' : 'accept'} a proposal
          </h2>
          <p className="text-gray-400 text-sm mb-10">Select an option below</p>

          <div className="flex space-x-4">
            <button 
              onClick={onClose}
              className="flex-1 bg-[#C10000] text-white py-3 rounded-full font-bold hover:bg-red-700 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 bg-[#003B95] text-white py-3 rounded-full font-bold hover:bg-blue-900 transition-all active:scale-95"
            >
              Proceed
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;