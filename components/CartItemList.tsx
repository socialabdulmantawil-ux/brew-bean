import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import {
  FileText,
  Maximize2,
  Minus,
  Pencil,
  Plus,
  PlusCircle,
  Trash2
} from 'lucide-react';
import type { CartItem, ModalType, Product, SwipeStart, SwipingItem } from '../types';
import EmptyCartSlideshow from './EmptyCartSlideshow';

interface CartItemListProps {
  cart: CartItem[];
  products: Product[];
  activeMenuId: string | null;
  onActiveMenuChange: (cartItemId: string | null) => void;
  swipeStart: MutableRefObject<SwipeStart | null>;
  swipingItem: SwipingItem | null;
  setSwipingItem: Dispatch<SetStateAction<SwipingItem | null>>;
  onRemoveItem: (cartItemId: string) => void;
  onOpenModal: (type: ModalType, item: CartItem) => void;
  onQuantityLongPressStart: (item: CartItem) => void;
  onQuantityLongPressEnd: () => void;
  onQuantityButtonClick: (item: CartItem, delta: number) => void;
  formatCurrency: (amount: number) => string;
}

export default function CartItemList({
  cart,
  products,
  activeMenuId,
  onActiveMenuChange,
  swipeStart,
  swipingItem,
  setSwipingItem,
  onRemoveItem,
  onOpenModal,
  onQuantityLongPressStart,
  onQuantityLongPressEnd,
  onQuantityButtonClick,
  formatCurrency
}: CartItemListProps) {
  return (
    <div className={`flex-1 min-h-0 ${cart.length === 0 ? 'relative overflow-hidden' : 'overflow-y-auto px-3 py-2 space-y-2.5 custom-scrollbar'}`}>
      {cart.length === 0 ? (
        <EmptyCartSlideshow products={products} />
      ) : (
        cart.map((item) => (
          <div
            key={item.cartItemId}
            className={`relative rounded-xl ${activeMenuId === item.cartItemId ? 'z-20' : ''}`}
          >
            {swipingItem?.cartItemId === item.cartItemId && swipingItem.offset < 0 && (
              <button
                type="button"
                onClick={() => onRemoveItem(item.cartItemId)}
                aria-label={`Remove ${item.name} from order`}
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
                  onRemoveItem(item.cartItemId);
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
                        NOTE: {item.notes.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold text-slate-100">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>

                  <div className="relative item-action-menu">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        onActiveMenuChange(activeMenuId === item.cartItemId ? null : item.cartItemId);
                      }}
                      className={`p-1 rounded-lg transition-colors ${
                        activeMenuId === item.cartItemId
                          ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent'
                      }`}
                      title="Edit item"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {activeMenuId === item.cartItemId && (
                      <div className="absolute right-0 top-7 w-44 bg-[#1a233a] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                        <button
                          onClick={() => onOpenModal('SIZE', item)}
                          className="w-full text-left px-3 py-1.5 text-[11px] text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 flex items-center space-x-2 transition-colors"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>Change Size</span>
                        </button>
                        <button
                          onClick={() => onOpenModal('ADDONS', item)}
                          className="w-full text-left px-3 py-1.5 text-[11px] text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 flex items-center space-x-2 transition-colors"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Add Ons</span>
                        </button>
                        <button
                          onClick={() => onOpenModal('NOTES', item)}
                          className="w-full text-left px-3 py-1.5 text-[11px] text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 flex items-center space-x-2 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Notes</span>
                        </button>
                        <div className="my-1 border-t border-slate-700/50"></div>
                        <button
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="w-full text-left px-3 py-1.5 text-[11px] text-red-400 hover:bg-red-500/20 hover:text-red-300 flex items-center space-x-2 transition-colors font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Item</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center bg-[#0b101d]/80 border border-slate-700/60 rounded-lg p-0.5">
                  <button
                    onPointerDown={() => onQuantityLongPressStart(item)}
                    onPointerUp={onQuantityLongPressEnd}
                    onPointerLeave={onQuantityLongPressEnd}
                    onPointerCancel={onQuantityLongPressEnd}
                    onClick={() => onQuantityButtonClick(item, -1)}
                    className="min-h-8 min-w-8 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label={`Decrease ${item.name} quantity or hold to enter quantity`}
                    title="Hold to enter quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-slate-200">{item.quantity}</span>
                  <button
                    onPointerDown={() => onQuantityLongPressStart(item)}
                    onPointerUp={onQuantityLongPressEnd}
                    onPointerLeave={onQuantityLongPressEnd}
                    onPointerCancel={onQuantityLongPressEnd}
                    onClick={() => onQuantityButtonClick(item, 1)}
                    className="min-h-8 min-w-8 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label={`Increase ${item.name} quantity or hold to enter quantity`}
                    title="Hold to enter quantity; quantities above 10 can be entered here"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
