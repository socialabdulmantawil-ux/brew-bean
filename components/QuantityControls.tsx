import { Minus, Plus } from 'lucide-react';
import type { CartItem } from '../types';

interface QuantityControlsProps {
  item: CartItem;
  onStartLongPress: (item: CartItem) => void;
  onEndLongPress: () => void;
  onChange: (item: CartItem, delta: number) => void;
}

export default function QuantityControls({
  item,
  onStartLongPress,
  onEndLongPress,
  onChange
}: QuantityControlsProps) {
  return (
    <div className="flex items-center bg-[#0b101d]/80 border border-slate-700/60 rounded-lg p-0.5">
      <button
        type="button"
        onPointerDown={() => onStartLongPress(item)}
        onPointerUp={onEndLongPress}
        onPointerLeave={onEndLongPress}
        onPointerCancel={onEndLongPress}
        onClick={() => onChange(item, -1)}
        className="min-h-8 min-w-8 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        aria-label={`Decrease ${item.name} quantity or hold to enter quantity`}
        title="Hold to enter quantity"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-5 text-center text-xs font-bold text-slate-200">{item.quantity}</span>
      <button
        type="button"
        onPointerDown={() => onStartLongPress(item)}
        onPointerUp={onEndLongPress}
        onPointerLeave={onEndLongPress}
        onPointerCancel={onEndLongPress}
        onClick={() => onChange(item, 1)}
        className="min-h-8 min-w-8 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        aria-label={`Increase ${item.name} quantity or hold to enter quantity`}
        title="Hold to enter quantity; quantities above 10 can be entered here"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
