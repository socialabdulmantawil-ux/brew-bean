import { FileText, Maximize2, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import type { CartItem, ModalType } from '../types';

interface ItemActionMenuProps {
  item: CartItem;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: (type: ModalType, item: CartItem) => void;
  onRemove: (cartItemId: string) => void;
}

export default function ItemActionMenu({
  item,
  isOpen,
  onToggle,
  onEdit,
  onRemove
}: ItemActionMenuProps) {
  return (
    <div className="relative item-action-menu">
      <button
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className={`p-1 rounded-lg transition-colors ${
          isOpen
            ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent'
        }`}
        title="Edit item"
      >
        <Pencil className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-7 w-44 bg-[#1a233a] border border-slate-700/80 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <button
            onClick={() => onEdit('SIZE', item)}
            className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 flex items-center space-x-2 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Change Size</span>
          </button>
          <button
            onClick={() => onEdit('ADDONS', item)}
            className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 flex items-center space-x-2 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Ons</span>
          </button>
          <button
            onClick={() => onEdit('NOTES', item)}
            className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 flex items-center space-x-2 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Notes / Instructions</span>
          </button>

          <div className="my-1 border-t border-slate-700/50"></div>

          <button
            onClick={() => onRemove(item.cartItemId)}
            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 hover:text-red-300 flex items-center space-x-2 transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Item</span>
          </button>
        </div>
      )}
    </div>
  );
}
