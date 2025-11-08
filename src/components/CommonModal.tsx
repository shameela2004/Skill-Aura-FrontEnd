// src/components/CommonModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiAlertTriangle } from "react-icons/fi";

export type ModalType = "confirm" | "success" | "error";

interface CommonModalProps {
  isOpen: boolean;
  type?: ModalType;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  type = "confirm",
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const icon =
    type === "success" ? (
      <FiCheckCircle className="text-green-500 w-12 h-12 mb-3" />
    ) : type === "error" ? (
      <FiXCircle className="text-red-500 w-12 h-12 mb-3" />
    ) : (
      <FiAlertTriangle className="text-yellow-500 w-12 h-12 mb-3" />
    );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <div className="flex flex-col items-center">
              {icon}
              <h2 className="text-lg font-semibold mb-2">{title}</h2>
              <p className="text-gray-600 mb-4">{message}</p>
            </div>

            {type === "confirm" ? (
              <div className="flex justify-center gap-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {confirmText}
                </button>
              </div>
            ) : (
              <button
                onClick={onCancel}
                className={`px-6 py-2 rounded-lg text-white ${
                  type === "success" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                OK
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommonModal;
