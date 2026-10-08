import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName?: string;
  message?: string;
  confirmText?: string;
  isDestructive?: boolean;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  message,
  confirmText = 'Confirm',
  isDestructive = true,
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center pt-2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
          isDestructive ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-[#00E5A8]/10 text-[#00E5A8] border border-[#00E5A8]/20'
        }`}>
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold font-display text-white mb-2">{title}</h3>

        {itemName && (
          <div className="bg-[#08111A] px-3.5 py-1.5 rounded-lg border border-white/5 font-mono text-xs text-[#00E5A8] max-w-full truncate mb-3">
            {itemName}
          </div>
        )}

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {message || 'Are you sure you want to proceed with this action? This cannot be undone.'}
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={loading}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-lg ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                : 'bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black shadow-[#00E5A8]/20'
            }`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
