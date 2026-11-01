import { ArrowRight, Check, PauseCircle, Tag, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../utils';

interface OrderSummaryProps {
  cartCount: number;
  orderType: string;
  promoActive: boolean;
  originalTotalAmount: number;
  totalAmount: number;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onTogglePromo: () => void;
  onCancelOrder: () => void;
  onCheckout: () => void;
}

export default function OrderSummary({
  cartCount,
  orderType,
  promoActive,
  originalTotalAmount,
  totalAmount,
  promoCode,
  onPromoCodeChange,
  onTogglePromo,
  onCancelOrder,
  onCheckout
}: OrderSummaryProps) {
  return (
    <div className="border-t border-slate-800/80 bg-[#0d1424] p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-200">Total Amount</span>
        <span className="flex items-center gap-2">
          {promoActive && (
            <span className="text-sm font-semibold text-slate-500 line-through">
              {formatCurrency(originalTotalAmount)}
            </span>
          )}
          <span className="text-xl font-extrabold text-blue-400">{formatCurrency(totalAmount)}</span>
        </span>
      </div>

      {orderType !== 'Delivery' && (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={promoCode}
                onChange={(event) => onPromoCodeChange(event.target.value)}
                placeholder="Promo code (e.g. SAVE10)"
                disabled={cartCount === 0}
                className="w-full bg-[#182238] border border-slate-700/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button
              onClick={onTogglePromo}
              disabled={cartCount === 0}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                promoActive
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {promoActive ? 'Applied' : 'Apply'}
            </button>
          </div>
          {promoActive && (
            <div className="flex items-center justify-between text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg">
              <span className="flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>10% OFF applied</span>
              </span>
              <button onClick={onTogglePromo} className="hover:text-emerald-200">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-12 gap-2 pt-1">
        <button className="col-span-4 bg-[#182238] hover:bg-slate-700/70 border border-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors">
          <PauseCircle className="w-4 h-4 text-slate-400" />
          <span>Hold Order</span>
        </button>
        <button
          onClick={onCancelOrder}
          className="col-span-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>
        <button
          onClick={onCheckout}
          disabled={cartCount === 0}
          className={`col-span-5 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg ${
            cartCount > 0
              ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
