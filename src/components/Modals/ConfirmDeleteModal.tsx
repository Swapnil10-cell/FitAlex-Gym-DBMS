import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  itemId?: string;
  confirmLabel?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemId,
  confirmLabel = 'Delete Member',
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#181C24] border border-rose-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#252B38] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">{title}</h2>
              <p className="text-xs text-rose-400 font-medium">Permanent Record Deletion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#212631] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            {description}
          </p>

          {(itemName || itemId) && (
            <div className="p-3.5 bg-[#0F1115] border border-[#252B38] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-sm text-white">{itemName}</span>
              {itemId && (
                <span className="font-mono-tabular text-xs text-slate-400 bg-[#181C24] px-2 py-0.5 rounded border border-[#252B38]">
                  {itemId}
                </span>
              )}
            </div>
          )}

          <div className="p-3 bg-rose-950/30 border border-rose-500/20 rounded-xl flex items-center gap-2.5 text-xs text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>This action cannot be undone. All check-ins and member records will be removed.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-[#12151C] border-t border-[#252B38] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#181C24] hover:bg-[#212631] border border-[#252B38] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-95 rounded-xl shadow-lg shadow-rose-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
