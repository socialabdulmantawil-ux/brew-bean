import type { Dispatch, SetStateAction } from 'react';
import { Banknote, Check, CheckCircle2, CreditCard, Printer, Wallet, X } from 'lucide-react';
import type { AddOn, CartItem, ModalType, SizeOption } from '../types';
import { formatCurrency } from '../utils';

interface OrderModalsProps {
  modalType: ModalType;
  setModalType: Dispatch<SetStateAction<ModalType>>;
  deliveryApp: string;
  setDeliveryApp: Dispatch<SetStateAction<string>>;
  otherDeliveryApp: string;
  setOtherDeliveryApp: Dispatch<SetStateAction<string>>;
  deliveryOrderNumber: string;
  setDeliveryOrderNumber: Dispatch<SetStateAction<string>>;
  deliveryDetailsValid: boolean;
  activeCartItem: CartItem | null;
  setActiveCartItem: Dispatch<SetStateAction<CartItem | null>>;
  quantityInput: string;
  setQuantityInput: Dispatch<SetStateAction<string>>;
  saveQuantity: () => void;
  saveItemChanges: (updatedItem: CartItem) => void;
  sizeOptions: SizeOption[];
  addOnOptions: AddOn[];
  paymentMethod: string;
  setPaymentMethod: Dispatch<SetStateAction<string>>;
  subtotal: number;
  promoActive: boolean;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  cardLastFour: string;
  setCardLastFour: Dispatch<SetStateAction<string>>;
  cashReceived: string;
  setCashReceived: Dispatch<SetStateAction<string>>;
  cashReceivedAmount: number;
  walletReference: string;
  setWalletReference: Dispatch<SetStateAction<string>>;
  paymentDetailsValid: boolean;
  orderType: string;
  deliveryAppName: string;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  currentTime: string;
}

export default function OrderModals(props: OrderModalsProps) {
  const {
    modalType, setModalType, deliveryApp, setDeliveryApp, otherDeliveryApp,
    setOtherDeliveryApp, deliveryOrderNumber, setDeliveryOrderNumber,
    deliveryDetailsValid, activeCartItem, setActiveCartItem, quantityInput,
    setQuantityInput, saveQuantity, saveItemChanges, sizeOptions, addOnOptions,
    paymentMethod, setPaymentMethod, subtotal, promoActive, discountAmount,
    taxAmount, totalAmount, cardLastFour, setCardLastFour, cashReceived,
    setCashReceived, cashReceivedAmount, walletReference, setWalletReference,
    paymentDetailsValid, orderType, deliveryAppName, cart, setCart, currentTime
  } = props;

  return (
    <>
      {/* MODAL DIALOGS FOR ACTION MENU ITEMS */}

      {/* DELIVERY ORDER DETAILS MODAL */}
      {modalType === 'DELIVERY_DETAILS' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-700/80 bg-[#131b2e] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Delivery Order Details</h3>
                <p className="text-xs text-slate-400">Enter the delivery platform and order number</p>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white" aria-label="Close delivery details">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-medium text-slate-300">Delivery app</span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {['Foodpanda', 'GrabFood', 'ShopeeFood', 'Other'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => {
                      setDeliveryApp(app);
                      if (app !== 'Other') setOtherDeliveryApp('');
                    }}
                    className={`min-h-24 flex flex-col items-center justify-center gap-2 rounded-xl border p-2 text-xs font-semibold transition-colors ${
                      deliveryApp === app
                        ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                        : 'border-slate-700/60 bg-[#1e293b]/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold ${
                      app === 'Foodpanda'
                        ? 'bg-pink-500/20 text-pink-300'
                        : app === 'GrabFood'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : app === 'ShopeeFood'
                            ? 'bg-orange-500/20 text-orange-300'
                            : 'bg-slate-700 text-slate-300'
                    }`}>
                      {app === 'Foodpanda' ? 'fp' : app === 'GrabFood' ? 'G' : app === 'ShopeeFood' ? 'S' : '+'}
                    </span>
                    <span>{app}</span>
                  </button>
                ))}
              </div>
            </div>

            {deliveryApp === 'Other' && (
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-300">Specify delivery app</span>
                <input
                  type="text"
                  value={otherDeliveryApp}
                  onChange={(event) => setOtherDeliveryApp(event.target.value)}
                  placeholder="Specify delivery app"
                  className="w-full rounded-xl border border-slate-700/80 bg-[#1e293b]/70 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </label>
            )}

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-300">Delivery order number</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                value={deliveryOrderNumber}
                onChange={(event) => setDeliveryOrderNumber(event.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Enter 4-digit order number"
                className="w-full rounded-xl border border-slate-700/80 bg-[#1e293b]/70 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </label>

            <div className="flex gap-2 border-t border-slate-800 pt-3">
              <button
                onClick={() => setModalType(null)}
                className="flex-1 rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setModalType('CHECKOUT_SUCCESS')}
                disabled={!deliveryDetailsValid}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-colors enabled:hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
              >
                Confirm Delivery Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK QUANTITY MODAL */}
      {modalType === 'QUANTITY' && activeCartItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              saveQuantity();
            }}
            className="w-full max-w-xs space-y-4 rounded-2xl border border-slate-700/80 bg-[#131b2e] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Set Quantity</h3>
                <p className="text-xs text-slate-400">{activeCartItem.name}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalType(null);
                  setActiveCartItem(null);
                }}
                className="text-slate-400 hover:text-white"
                aria-label="Close quantity editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-300">Enter quantity</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                value={quantityInput}
                onChange={(event) => setQuantityInput(event.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-slate-700/80 bg-[#1e293b]/70 p-3 text-lg font-bold text-slate-100 focus:border-blue-500 focus:outline-none"
                aria-label="Item quantity"
              />
            </label>

            <div className="grid grid-cols-3 gap-2" aria-label="Numeric keypad">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0', '⌫'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (key === 'Clear') {
                      setQuantityInput('');
                    } else if (key === '⌫') {
                      setQuantityInput(value => value.slice(0, -1));
                    } else {
                      setQuantityInput(value => `${value}${key}`.replace(/^0+(?=\d)/, ''));
                    }
                  }}
                  className="min-h-11 rounded-xl border border-slate-700/70 bg-[#1e293b]/70 text-sm font-bold text-slate-100 transition-colors hover:bg-slate-700"
                  aria-label={key === '⌫' ? 'Delete last digit' : key === 'Clear' ? 'Clear quantity' : key}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="flex gap-2 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => {
                  setModalType(null);
                  setActiveCartItem(null);
                }}
                className="flex-1 rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!Number.isSafeInteger(Number(quantityInput)) || Number(quantityInput) < 1}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-colors enabled:hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
              >
                Set Quantity
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CHANGE SIZE MODAL */}
      {modalType === 'SIZE' && activeCartItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131b2e] border border-slate-700/80 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Change Item Size</h3>
                <p className="text-xs text-slate-400">{activeCartItem.name}</p>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto hide-scrollbar">
              {sizeOptions.map((sz) => {
                const isSelected = activeCartItem.size === sz.name;
                const calculatedPrice = activeCartItem.basePrice + sz.adjustment;
                return (
                  <button
                    key={sz.id}
                    onClick={() => {
                      setActiveCartItem({
                        ...activeCartItem,
                        size: sz.name,
                        sizeAdjustment: sz.adjustment
                      });
                    }}
                    className={`w-full min-h-20 flex flex-col items-start justify-between gap-3 p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      isSelected 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                        : 'bg-[#1e293b]/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{sz.name}</span>
                    <span className="text-blue-400 font-bold">
                      {formatCurrency(calculatedPrice)}
                      {sz.adjustment !== 0 && (
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({sz.adjustment > 0 ? '+' : ''}{formatCurrency(sz.adjustment)})
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex space-x-2 pt-2 border-t border-slate-800">
              <button 
                onClick={() => setModalType(null)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={() => saveItemChanges(activeCartItem)}
                className="flex-1 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ONS MODAL */}
      {modalType === 'ADDONS' && activeCartItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131b2e] border border-slate-700/80 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Customize Add Ons</h3>
                <p className="text-xs text-slate-400">{activeCartItem.name}</p>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto hide-scrollbar">
              {addOnOptions.map((addon) => {
                const isChecked = activeCartItem.selectedAddOns?.some(a => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => {
                      const currentAddOns = activeCartItem.selectedAddOns || [];
                      const updated = isChecked
                        ? currentAddOns.filter(a => a.id !== addon.id)
                        : [...currentAddOns, addon];
                      setActiveCartItem({ ...activeCartItem, selectedAddOns: updated });
                    }}
                    className={`w-full min-h-20 flex flex-col items-start justify-between gap-3 p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      isChecked 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                        : 'bg-[#1e293b]/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-blue-600 border-blue-500' : 'border-slate-600'}`}>
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span>{addon.name}</span>
                    </div>
                    <span className="text-blue-400 font-bold">
                      {addon.price > 0 ? `+${formatCurrency(addon.price)}` : 'Free'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex space-x-2 pt-2 border-t border-slate-800">
              <button 
                onClick={() => setModalType(null)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={() => saveItemChanges(activeCartItem)}
                className="flex-1 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30"
              >
                Apply Modifiers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTES MODAL */}
      {modalType === 'NOTES' && activeCartItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131b2e] border border-slate-700/80 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Special Preparation Notes</h3>
                <p className="text-xs text-slate-400">{activeCartItem.name}</p>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <textarea 
                rows={3}
                placeholder="e.g. Extra hot, soy milk, no whipped cream, write happy birthday..."
                value={activeCartItem.notes || ''}
                onChange={(e) => setActiveCartItem({ ...activeCartItem, notes: e.target.value })}
                className="w-full bg-[#1e293b]/70 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex space-x-2 pt-2 border-t border-slate-800">
              <button 
                onClick={() => setModalType(null)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={() => saveItemChanges(activeCartItem)}
                className="flex-1 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT METHOD MODAL */}
      {modalType === 'PAYMENT' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131b2e] border border-slate-700/80 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Checkout</h3>
                <p className="text-xs text-slate-400">Review the order and enter payment details</p>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { method: 'Card', icon: CreditCard },
                { method: 'Cash', icon: Banknote },
                { method: 'Wallet', icon: Wallet }
              ].map(({ method, icon: Icon }) => {
                const isSelected = paymentMethod === method;
                return (
                  <button
                    key={method}
                    onClick={() => {
                      setPaymentMethod(method);
                      if (method === 'Cash') setModalType('CASH_TENDER');
                    }}
                    className={`min-h-24 flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-[#1e293b]/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{method}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1.5 text-xs border-y border-slate-800/60 py-3">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-200">{formatCurrency(subtotal)}</span>
              </div>
              {promoActive && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Discount (10%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Tax / VAT (15%)</span>
                <span className="font-semibold text-slate-200">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-lg text-blue-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="space-y-2">
              {paymentMethod === 'Card' && (
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-300">Last four digits of transaction</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    value={cardLastFour}
                    onChange={(event) => setCardLastFour(event.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="e.g. 1234"
                    className="w-full bg-[#1e293b]/70 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </label>
              )}
              {paymentMethod === 'Cash' && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-[#1e293b]/50 p-3">
                  <div className="min-w-0">
                    <span className="block text-xs font-medium text-slate-300">Cash received</span>
                    <span className="block truncate text-sm font-bold text-white">
                      {cashReceived.trim() && Number.isFinite(cashReceivedAmount) ? formatCurrency(cashReceivedAmount) : 'Select amount'}
                    </span>
                    {Number.isFinite(cashReceivedAmount) && cashReceived.trim() !== '' && cashReceivedAmount >= totalAmount && (
                      <span className="block text-xs text-emerald-400">
                        Change due: {formatCurrency(cashReceivedAmount - totalAmount)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setModalType('CASH_TENDER')}
                    className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    {cashReceived.trim() ? 'Change amount' : 'Choose amount'}
                  </button>
                </div>
              )}
              {paymentMethod === 'Wallet' && (
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-300">Wallet transaction reference</span>
                  <input
                    type="text"
                    autoComplete="off"
                    value={walletReference}
                    onChange={(event) => setWalletReference(event.target.value)}
                    placeholder="Enter transaction/reference ID"
                    className="w-full bg-[#1e293b]/70 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </label>
              )}
            </div>

            <div className="flex space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setModalType(null)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => setModalType('CHECKOUT_SUCCESS')}
                disabled={!paymentDetailsValid}
                className={`flex-1 py-2 text-xs font-bold text-white rounded-xl shadow-lg transition-colors ${
                  paymentDetailsValid
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASH AMOUNT MODAL */}
      {modalType === 'CASH_TENDER' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131b2e] border border-slate-700/80 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Cash Received</h3>
                <p className="text-xs text-slate-400">Order total: {formatCurrency(totalAmount)}</p>
              </div>
              <button onClick={() => setModalType('PAYMENT')} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[totalAmount, ...[5, 10, 20, 50, 100, 200, 500, 1000].filter((bill) => bill > totalAmount)].map((amount, index) => {
                const isExactAmount = index === 0;
                const isSelected = Number(cashReceived) === amount;
                return (
                  <button
                    key={isExactAmount ? 'exact-total' : amount}
                    onClick={() => {
                      setCashReceived(amount.toFixed(2));
                      setModalType('PAYMENT');
                    }}
                    className={`min-h-20 flex flex-col items-center justify-center gap-1 rounded-xl border p-3 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-[#1e293b]/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-base font-bold">{formatCurrency(amount)}</span>
                    <span className="text-[10px] text-slate-400">{isExactAmount ? 'Exact amount' : 'Bill'}</span>
                  </button>
                );
              })}
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-300">Other amount</span>
              <input
                type="number"
                min={totalAmount}
                step="0.01"
                inputMode="decimal"
                value={cashReceived}
                onChange={(event) => setCashReceived(event.target.value)}
                placeholder={`Enter at least ${formatCurrency(totalAmount)}`}
                className="no-number-spinner w-full bg-[#1e293b]/70 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </label>

            <div className="flex space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setModalType('PAYMENT')}
                className="flex-1 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => setModalType('PAYMENT')}
                disabled={!Number.isFinite(cashReceivedAmount) || cashReceived.trim() === '' || cashReceivedAmount < totalAmount}
                className={`flex-1 py-2 text-xs font-bold text-white rounded-xl shadow-lg transition-colors ${
                  Number.isFinite(cashReceivedAmount) && cashReceived.trim() !== '' && cashReceivedAmount >= totalAmount
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                Use This Amount
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT SUCCESS MODAL */}
      {modalType === 'CHECKOUT_SUCCESS' && (
        <div className="receipt-print-root fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-2 backdrop-blur-md sm:p-4">
          <div className="my-auto flex w-full max-w-md flex-col items-center gap-4 py-4">
            <div className="receipt-confirmation-header text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {orderType === 'Delivery' ? 'Delivery Order Confirmed!' : 'Order Completed!'}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {orderType === 'Delivery'
                  ? `Delivery order #${deliveryOrderNumber} confirmed`
                  : 'Receipt generated for Order #1048'}
              </p>
            </div>

            <article className="receipt-paper w-[80mm] shrink-0 bg-white p-4 font-mono text-[10px] leading-snug text-black shadow-2xl">
              <header className="border-b border-dashed border-black pb-2 text-center">
                <h2 className="text-base font-bold tracking-wide">BREW &amp; BEAN</h2>
                <p className="mt-0.5 text-[9px] uppercase tracking-widest">Order Receipt</p>
                {orderType === 'Delivery' && (
                  <p className="mt-1 border-y-2 border-black py-1 text-[11px] font-black uppercase tracking-wide">
                    Delivery: {deliveryAppName} | Order #{deliveryOrderNumber}
                  </p>
                )}
              </header>

              <section className="space-y-0.5 border-b border-dashed border-black py-2">
                <div className="flex justify-between gap-2">
                  <span>Order #</span>
                  <span>1048</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Date</span>
                  <span>{new Date().toLocaleDateString('en-PH')}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Time</span>
                  <span>{currentTime}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Order type</span>
                  <span>{orderType}</span>
                </div>
              </section>

              <section className="border-b border-dashed border-black py-2">
                <div className="mb-1 flex justify-between font-bold">
                  <span>ITEM</span>
                  <span>AMOUNT</span>
                </div>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="break-words">
                      <div className="flex justify-between gap-2">
                        <span className="min-w-0 flex-1">{item.name}</span>
                        <span className="shrink-0">{formatCurrency(item.unitPrice * item.quantity)}</span>
                      </div>
                      <p className="text-[9px]">
                        {item.quantity} × {formatCurrency(item.unitPrice)} · {item.size}
                      </p>
                      {item.selectedAddOns.length > 0 && (
                        <p className="text-[9px]">
                          + {item.selectedAddOns.map((addOn) => addOn.name).join(', ')}
                        </p>
                      )}
                      {item.notes.trim() && (
                        <p className="break-words text-[9px]">Note: {item.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-0.5 border-b border-dashed border-black py-2">
                <div className="flex justify-between gap-2">
                  <span>Items ({cart.reduce((count, item) => count + item.quantity, 0)})</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between gap-2">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <span>Tax / VAT (15%)</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-black pt-1 text-xs font-bold">
                  <span>{orderType === 'Delivery' ? 'ORDER TOTAL' : 'TOTAL PAID'}</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </section>

              {orderType !== 'Delivery' && (
                <section className="space-y-0.5 border-b border-dashed border-black py-2">
                  <div className="flex justify-between gap-2">
                    <span>Payment</span>
                    <span>{paymentMethod}</span>
                  </div>
                  {paymentMethod === 'Card' && (
                    <div className="flex justify-between gap-2">
                      <span>Transaction ending</span>
                      <span>•••• {cardLastFour}</span>
                    </div>
                  )}
                  {paymentMethod === 'Cash' && (
                    <>
                      <div className="flex justify-between gap-2">
                        <span>Cash received</span>
                        <span>{formatCurrency(cashReceivedAmount)}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span>Change</span>
                        <span>{formatCurrency(cashReceivedAmount - totalAmount)}</span>
                      </div>
                    </>
                  )}
                  {paymentMethod === 'Wallet' && (
                    <div className="flex justify-between gap-2">
                      <span>Wallet reference</span>
                      <span className="break-all text-right">{walletReference}</span>
                    </div>
                  )}
                </section>
              )}

              <footer className="pt-2 text-center text-[9px]">
                <p>Thank you for your order!</p>
                <p className="mt-0.5">Please come again</p>
              </footer>
            </article>

            <div className="receipt-actions flex w-full max-w-[80mm] flex-col gap-2">
              <button
                onClick={() => window.print()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500"
              >
                <Printer className="h-4 w-4" />
                Print 80 mm Receipt
              </button>
              <button
                onClick={() => {
                  setCart([]);
                  setCardLastFour('');
                  setCashReceived('');
                  setWalletReference('');
                  setDeliveryApp('');
                  setOtherDeliveryApp('');
                  setDeliveryOrderNumber('');
                  setModalType(null);
                }}
                className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-200 transition-colors hover:bg-slate-700"
              >
                Start New Order
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
