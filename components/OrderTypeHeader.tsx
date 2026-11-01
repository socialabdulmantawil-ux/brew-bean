import { ChevronDown, Coffee, ShoppingBag, Utensils } from 'lucide-react';

interface OrderTypeHeaderProps {
  customerType: string;
  onCustomerChange: (customerType: string) => void;
  orderType: string;
  onOrderTypeChange: (orderType: string) => void;
}

const orderTypes = [
  { type: 'Dine-in', icon: Coffee },
  { type: 'Takeout', icon: ShoppingBag },
  { type: 'Delivery', icon: Utensils }
];

export default function OrderTypeHeader({
  customerType,
  onCustomerChange,
  orderType,
  onOrderTypeChange
}: OrderTypeHeaderProps) {
  return (
    <div className="p-3.5 border-b border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="bg-blue-600/20 text-blue-400 font-semibold px-3 py-1 rounded-lg text-xs border border-blue-500/30 tracking-wide">
          Order #1048
        </span>
        <div className="relative flex-1 ml-3">
          <select
            value={customerType}
            onChange={(event) => onCustomerChange(event.target.value)}
            className="w-full bg-[#1e293b]/80 border border-slate-700/70 text-slate-200 text-xs rounded-lg px-3 py-1.5 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer pr-8 font-medium"
          >
            <option>Walk-in Customer</option>
            <option>VIP Member - John Doe</option>
            <option>Table #04</option>
            <option>Table #12</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0b101d]/60 rounded-xl border border-slate-800/60">
        {orderTypes.map(({ type, icon: Icon }) => {
          const isActive = orderType === type;
          return (
            <button
              key={type}
              onClick={() => onOrderTypeChange(type)}
              className={`flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{type}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
