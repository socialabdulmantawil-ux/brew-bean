import { Trash2 } from 'lucide-react';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import type { CartItem, ModalType } from '../types';
import { formatCurrency } from '../utils';
import ItemActionMenu from './ItemActionMenu';
import QuantityControls from './QuantityControls';

interface SwipingItem {
  cartItemId: string;
  offset: number;
}

interface SwipeStart {
  cartItemId: string;
  x: number;
  offset: number;
}

interface CartItemCardProps {
  item: CartItem;
  activeMenu: boolean;
  onToggleMenu: () => void;
  onEdit: (type: ModalType, item: CartItem) => void;
  onRemove: (cartItemId: string) => void;
  swipingItem: SwipingItem | null;
  setSwipingItem: Dispatch<SetStateAction<SwipingItem | null>>;
  swipeStart: MutableRefObject<SwipeStart | null>;
  onStartQuantityLongPress: (item: CartItem) => void;
  onEndQuantityLongPress: () => void;
  onQuantityChange: (item: CartItem, delta: number) => void;
}

export default function CartItemCard({
  item,
  activeMenu,
  onToggleMenu,
  onEdit,
  onRemove,
  swipingItem,
  setSwipingItem,
  swipeStart,
  onStartQuantityLongPress,
  onEndQuantityLongPress,
  onQuantityChange
}: CartItemCardProps) {
  return (
    <div className={`relative rounded-xl ${activeMenu ? 'z-20 overflow-visible' : 'overflow-hidden'}`}>
      {swipingItem?.cartItemId === item.cartItemId && swipingItem.offset < 0 && (
        <button
          type="button"
          onClick={() => onRemove(item.cartItemId)}
          aria-label={`Remove ${item.name} from order`}
          tabIndex={0}
          style={{ width: Math.abs(swipingItem.offset) }}
          className="absolute inset-y-0 right-0 flex items-center justify-center bg-red-500/20 text-red-300 transition-[width] duration-75 hover:bg-red-500/40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      <div
        onPointerDown={(event) => {
          if (
            event.button !== 0 ||
            (event.target instanceof Element && event.target.closest('button, input, textarea, select'))
          ) return;
          swipeStart.current = { cartItemId: item.cartItemId, x: event.clientX, offset: 0 };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const start = swipeStart.current;
          if (!start || start.cartItemId !== item.cartItemId) return;
          const deltaX = Math.min(0, event.clientX - start.x);
          start.offset = Math.max(deltaX, -140);
          setSwipingItem({ cartItemId: item.cartItemId, offset: start.offset });
        }}
        onPointerUp={() => {
          const start = swipeStart.current;
          if (start?.cartItemId === item.cartItemId && start.offset <= -80) {
            onRemove(item.cartItemId);
          }
          swipeStart.current = null;
          setSwipingItem(null);
        }}
        onPointerCancel={() => {
          swipeStart.current = null;
          setSwipingItem(null);
        }}
        style={{
          transform: `translateX(${swipingItem?.cartItemId === item.cartItemId ? swipingItem.offset : 0}px)`,
          touchAction: 'pan-y'
        }}
        className="bg-[#1e293b]/50 border border-slate-700/40 hover:border-slate-600/60 rounded-xl p-2.5 transition-transform duration-150 flex items-start justify-between group relative gap-2"
      >
        <div className="flex items-start space-x-2.5 min-w-0 flex-1">
          <img
            src={item.image}
            alt={item.name}
            className="w-11 h-11 rounded-lg object-cover bg-slate-800 border border-slate-700/50 shrink-0 mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-slate-100 truncate">{item.name}</h4>
            <div className="mt-1 space-y-0.5">
              <div className="text-[11px] text-slate-400 font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                <span>Size: <strong className="text-slate-200 font-semibold">{item.size}</strong></span>
              </div>

              {item.selectedAddOns.length > 0 && (
                <div className="space-y-0.5 pt-0.5">
                  {item.selectedAddOns.map((addon) => {
                    const displayName = addon.name.length > 15
                      ? `${addon.name.slice(0, 15)}...`
                      : addon.name;
                    return (
                      <div
                        key={addon.id || addon.name}
                        className="text-[11px] text-emerald-400/90 flex items-center space-x-1 font-medium pl-2 border-l border-emerald-500/30 truncate max-w-[150px]"
                        title={addon.name}
                      >
                        <span className="truncate">+ {displayName}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {item.notes && (
                <div className="text-[11px] text-amber-300/90 italic bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 mt-1 max-w-[170px] truncate">
                  Note: {item.notes}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between self-stretch shrink-0 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-slate-100">
              {formatCurrency(item.unitPrice * item.quantity)}
            </span>
            <ItemActionMenu
              item={item}
              isOpen={activeMenu}
              onToggle={onToggleMenu}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          </div>

          <QuantityControls
            item={item}
            onStartLongPress={onStartQuantityLongPress}
            onEndLongPress={onEndQuantityLongPress}
            onChange={onQuantityChange}
          />
        </div>
      </div>
    </div>
  );
}
