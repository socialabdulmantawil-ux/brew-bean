import { useState, useEffect, useRef } from 'react';
import { 
  Coffee, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Minus, 
  Pencil, 
  Trash2, 
  Maximize2, 
  PlusCircle, 
  FileText, 
  X, 
  Check, 
  CreditCard, 
  Banknote, 
  Wallet, 
  PauseCircle, 
  ShoppingBag, 
  Utensils, 
  Sparkles, 
  ChevronDown, 
  Clock, 
  Wifi, 
  Settings, 
  Tag, 
  ArrowRight,
  CheckCircle2,
  Printer,
  CupSoda,
  Cookie
} from 'lucide-react';

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  tag: string | null;
  tagColor?: string;
  image: string;
  defaultOptions: { size: string; addOns: string[] };
}

interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  size: string;
  sizeAdjustment: number;
  selectedAddOns: AddOn[];
  notes: string;
  image: string;
}

type ModalType = 'SIZE' | 'ADDONS' | 'NOTES' | 'QUANTITY' | 'DELIVERY_DETAILS' | 'PAYMENT' | 'CASH_TENDER' | 'CHECKOUT_SUCCESS' | null;

// Sample Product Catalog Data matching reference image
const CATALOG_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Espresso Double',
    category: 'Coffee',
    price: 3.50,
    stock: 45,
    tag: 'Popular',
    tagColor: 'bg-indigo-600',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Single shot', addOns: [] }
  },
  {
    id: 'p2',
    name: 'Iced Latte',
    category: 'Coffee',
    price: 4.75,
    stock: 32,
    tag: null,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Regular', addOns: [] }
  },
  {
    id: 'p3',
    name: 'Caramel Macchiato',
    category: 'Coffee',
    price: 5.25,
    stock: 20,
    tag: 'Hot',
    tagColor: 'bg-red-500',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Large', addOns: ['50% sugar'] }
  },
  {
    id: 'p4',
    name: 'Cappuccino',
    category: 'Coffee',
    price: 4.25,
    stock: 18,
    tag: null,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Regular', addOns: [] }
  },
  {
    id: 'p5',
    name: 'Butter Croissant',
    category: 'Bakery',
    price: 3.00,
    stock: 15,
    tag: 'Fresh',
    tagColor: 'bg-emerald-500',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Regular', addOns: [] }
  },
  {
    id: 'p6',
    name: 'Avocado Toast',
    category: 'Meals',
    price: 8.50,
    stock: 12,
    tag: null,
    image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Standard', addOns: [] }
  },
  {
    id: 'p7',
    name: 'Club Sandwich',
    category: 'Meals',
    price: 9.75,
    stock: 8,
    tag: null,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Full', addOns: [] }
  },
  {
    id: 'p8',
    name: 'Blueberry Muffin',
    category: 'Bakery',
    price: 3.50,
    stock: 24,
    tag: null,
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Regular', addOns: [] }
  },
  {
    id: 'p9',
    name: 'Matcha Green Tea',
    category: 'Drinks',
    price: 5.00,
    stock: 30,
    tag: null,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Medium', addOns: [] }
  },
  {
    id: 'p10',
    name: 'Fresh Orange Juice',
    category: 'Drinks',
    price: 4.50,
    stock: 25,
    tag: null,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Regular', addOns: [] }
  },
  {
    id: 'p11',
    name: 'Pepperoni Slice',
    category: 'Meals',
    price: 4.25,
    stock: 14,
    tag: null,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: '1 Slice', addOns: [] }
  },
  {
    id: 'p12',
    name: 'Chocolate Brownie',
    category: 'Bakery',
    price: 3.75,
    stock: 19,
    tag: 'Popular',
    tagColor: 'bg-indigo-600',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Piece', addOns: [] }
  },
  {
    id: 'p13',
    name: 'Sparkling Water',
    category: 'Drinks',
    price: 2.25,
    stock: 50,
    tag: null,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: '500ml', addOns: [] }
  },
  {
    id: 'p14',
    name: 'Classic Burger',
    category: 'Meals',
    price: 10.50,
    stock: 10,
    tag: 'Chef Special',
    tagColor: 'bg-amber-500',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Single Patty', addOns: [] }
  },
  {
    id: 'p15',
    name: 'Iced Tea Lemon',
    category: 'Drinks',
    price: 3.75,
    stock: 28,
    tag: null,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400',
    defaultOptions: { size: 'Regular', addOns: [] }
  }
];

// Available Size Options with Price adjustments
const SIZE_OPTIONS = [
  { id: 'small', name: 'Small', adjustment: -0.50 },
  { id: 'regular', name: 'Regular', adjustment: 0.00 },
  { id: 'large', name: 'Large', adjustment: 0.75 },
  { id: 'xlarge', name: 'X-Large', adjustment: 1.25 }
];

// Available Add-On Modifiers
const ADD_ON_OPTIONS: AddOn[] = [
  { id: 'extra_shot', name: 'Extra Espresso Shot', price: 1.00 },
  { id: 'caramel_syrup', name: 'Caramel Syrup', price: 0.50 },
  { id: 'vanilla_syrup', name: 'Vanilla Syrup', price: 0.50 },
  { id: 'almond_milk', name: 'Almond Milk', price: 0.75 },
  { id: 'oat_milk', name: 'Oat Milk', price: 0.75 },
  { id: 'whipped_cream', name: 'Whipped Cream', price: 0.60 },
  { id: 'less_ice', name: 'Less Ice', price: 0.00 },
  { id: 'sugar_50', name: '50% Sugar', price: 0.00 }
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

export default function App() {
  // Initial cart matching reference screenshot
  const [cart, setCart] = useState<CartItem[]>([
    {
      cartItemId: 'c1',
      productId: 'p3',
      name: 'Iced Caramel Macchiato',
      basePrice: 4.50,
      unitPrice: 5.25,
      quantity: 2,
      size: 'Large',
      sizeAdjustment: 0.75,
      selectedAddOns: [{ id: 'sugar_50', name: '50% sugar', price: 0 }],
      notes: '',
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400'
    },
    {
      cartItemId: 'c2',
      productId: 'p1',
      name: 'Espresso Double',
      basePrice: 3.50,
      unitPrice: 3.50,
      quantity: 1,
      size: 'Single shot',
      sizeAdjustment: 0,
      selectedAddOns: [],
      notes: '',
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'
    },
    {
      cartItemId: 'c3',
      productId: 'p5',
      name: 'Butter Croissant',
      basePrice: 3.00,
      unitPrice: 3.00,
      quantity: 1,
      size: 'Regular',
      sizeAdjustment: 0,
      selectedAddOns: [],
      notes: '',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400'
    }
  ]);

  // Order state
  const [orderType, setOrderType] = useState('Dine-in');
  const [customerType, setCustomerType] = useState('Walk-in Customer');
  const [promoCode, setPromoCode] = useState('SAVE10');
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [cardLastFour, setCardLastFour] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [walletReference, setWalletReference] = useState('');
  const [deliveryApp, setDeliveryApp] = useState('');
  const [otherDeliveryApp, setOtherDeliveryApp] = useState('');
  const [deliveryOrderNumber, setDeliveryOrderNumber] = useState('');
  
  // Right panel filtering
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown menu state for item actions
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modals state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [activeCartItem, setActiveCartItem] = useState<CartItem | null>(null);
  const [quantityInput, setQuantityInput] = useState('');
  const quantityPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quantityLongPressTriggered = useRef(false);
  const swipeStart = useRef<{ cartItemId: string; x: number; offset: number } | null>(null);
  const [swipingItem, setSwipingItem] = useState<{ cartItemId: string; offset: number } | null>(null);

  // System time ticker
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => () => {
    if (quantityPressTimer.current) clearTimeout(quantityPressTimer.current);
  }, []);

  // Close popup menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target instanceof Element && !e.target.closest('.item-action-menu')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Cart operations
  const handleQuantityChange = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = delta > 0
          ? Math.min(item.quantity + delta, 10)
          : item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const openQuantityEditor = (item: CartItem) => {
    setActiveCartItem(item);
    setQuantityInput(String(item.quantity));
    setModalType('QUANTITY');
  };

  const startQuantityLongPress = (item: CartItem) => {
    quantityLongPressTriggered.current = false;
    quantityPressTimer.current = setTimeout(() => {
      quantityLongPressTriggered.current = true;
      quantityPressTimer.current = null;
      openQuantityEditor(item);
    }, 500);
  };

  const endQuantityLongPress = () => {
    if (quantityPressTimer.current) {
      clearTimeout(quantityPressTimer.current);
      quantityPressTimer.current = null;
    }
  };

  const handleQuantityButtonClick = (item: CartItem, delta: number) => {
    if (quantityLongPressTriggered.current) {
      quantityLongPressTriggered.current = false;
      return;
    }
    if (delta > 0 && item.quantity >= 10) {
      openQuantityEditor(item);
      return;
    }
    handleQuantityChange(item.cartItemId, delta);
  };

  const saveQuantity = () => {
    const quantity = Number(quantityInput);
    if (!activeCartItem || !Number.isSafeInteger(quantity) || quantity < 1) return;
    setCart(prev => prev.map(item =>
      item.cartItemId === activeCartItem.cartItemId ? { ...item, quantity } : item
    ));
    setModalType(null);
    setActiveCartItem(null);
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    setActiveMenuId(null);
  };

  const handleAddToCart = (product: Product) => {
    // Check if item exists in cart
    const existingIndex = cart.findIndex(c => c.productId === product.id && c.size === 'Regular' && c.selectedAddOns.length === 0);
    if (existingIndex > -1) {
      handleQuantityChange(cart[existingIndex].cartItemId, 1);
    } else {
      const newItem = {
        cartItemId: 'c_' + Date.now() + Math.random().toString(36).substr(2, 4),
        productId: product.id,
        name: product.name,
        basePrice: product.price,
        unitPrice: product.price,
        quantity: 1,
        size: 'Regular',
        sizeAdjustment: 0,
        selectedAddOns: [],
        notes: '',
        image: product.image
      };
      setCart(prev => [newItem, ...prev]);
    }
  };

  // Recalculate price helper
  const calculateUnitPrice = (basePrice: number, sizeAdjustment: number, addOns: AddOn[]) => {
    const addOnsTotal = addOns.reduce((acc, curr) => acc + (curr.price || 0), 0);
    return basePrice + sizeAdjustment + addOnsTotal;
  };

  // Modals actions
  const openModal = (type: ModalType, item: CartItem | null) => {
    setActiveCartItem(item ? { ...item, selectedAddOns: [...item.selectedAddOns] } : null);
    setModalType(type);
    setActiveMenuId(null);
  };

  const saveItemChanges = (updatedItem: CartItem) => {
    const newUnitPrice = calculateUnitPrice(
      updatedItem.basePrice,
      updatedItem.sizeAdjustment || 0,
      updatedItem.selectedAddOns || []
    );
    
    setCart(prev => prev.map(item => 
      item.cartItemId === updatedItem.cartItemId 
        ? { ...updatedItem, unitPrice: newUnitPrice } 
        : item
    ));
    setModalType(null);
    setActiveCartItem(null);
  };

  // Financial Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const originalTotalAmount = subtotal * 1.15;
  const promoActive = cart.length > 0 && orderType !== 'Delivery' && isPromoApplied;
  const discountAmount = promoActive ? subtotal * 0.10 : 0;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * 0.15; // 15% Tax/VAT
  const totalAmount = taxableAmount + taxAmount;
  const cashReceivedAmount = Number.parseFloat(cashReceived);
  useEffect(() => {
    if (paymentMethod === 'Cash') {
      setCashReceived(totalAmount.toFixed(2));
    }
  }, [paymentMethod, totalAmount]);

  useEffect(() => {
    if (cart.length === 0 && isPromoApplied) {
      setIsPromoApplied(false);
    }
  }, [cart.length, isPromoApplied]);

  useEffect(() => {
    if (orderType === 'Delivery' && isPromoApplied) {
      setIsPromoApplied(false);
    }
  }, [orderType, isPromoApplied]);

  const togglePromo = () => {
    if (cart.length === 0 || orderType === 'Delivery') return;
    setIsPromoApplied(applied => !applied);
  };
  const paymentDetailsValid =
    (paymentMethod === 'Card' && /^\d{4}$/.test(cardLastFour)) ||
    (paymentMethod === 'Cash' && cashReceived.trim() !== '' && Number.isFinite(cashReceivedAmount) && cashReceivedAmount >= totalAmount) ||
    (paymentMethod === 'Wallet' && walletReference.trim().length > 0);
  const deliveryDetailsValid =
    deliveryApp.trim().length > 0 &&
    (deliveryApp !== 'Other' || otherDeliveryApp.trim().length > 0) &&
    /^\d{4}$/.test(deliveryOrderNumber);
  const deliveryAppName = deliveryApp === 'Other' ? otherDeliveryApp.trim() : deliveryApp;

  // Filter products for catalog
  const filteredProducts = CATALOG_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All Items' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#0b101d] text-slate-100 font-sans select-none md:h-screen md:min-h-0 md:overflow-hidden">
      
      {/* TOP HEADER / NAVBAR */}
      <header className="min-h-14 bg-[#131b2e] border-b border-slate-800/80 px-3 sm:px-4 flex items-center justify-between gap-3 z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30">
            POS
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-blue-400 border border-slate-700/50">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight text-white tracking-wide">Brew & Bean</h1>
              <p className="text-[11px] text-slate-400 leading-none">Point of Sale <span className="text-slate-600">•</span> Terminal 01</p>
            </div>
          </div>
        </div>

        {/* Center / Right status bar items */}
        <div className="flex items-center space-x-2 sm:space-x-6 text-xs">
          <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Wifi className="w-3.5 h-3.5" />
            <span>Online</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-slate-300 font-medium bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/40">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{currentTime || '10:24 AM'}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </span>
          </div>

          <button className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 rounded-lg transition-colors border border-slate-700/50">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN BODY: LEFT ORDER PANEL & RIGHT CATALOG GRID */}
      <div className="flex flex-1 flex-col overflow-visible md:flex-row md:overflow-hidden">
        
        {/* LEFT PANEL: ORDER LIST & CALCULATIONS */}
        <div className="w-full bg-[#131b2e]/90 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col min-h-[65vh] md:min-h-0 md:w-[430px] md:h-full shrink-0 shadow-2xl relative z-10">
          
          {/* Top Order Meta Header */}
          <div className="p-3.5 border-b border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-blue-600/20 text-blue-400 font-semibold px-3 py-1 rounded-lg text-xs border border-blue-500/30 tracking-wide">
                Order #1048
              </span>
              <div className="relative flex-1 ml-3">
                <select 
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
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

            {/* Order Type Toggle Buttons */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0b101d]/60 rounded-xl border border-slate-800/60">
              {[
                { type: 'Dine-in', icon: Coffee },
                { type: 'Takeout', icon: ShoppingBag },
                { type: 'Delivery', icon: Utensils }
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = orderType === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => setOrderType(item.type)}
                    className={`flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{item.type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <ShoppingBag className="w-12 h-12 mb-3 stroke-[1.5] text-slate-600" />
                <p className="text-sm font-medium text-slate-400">Order list is empty</p>
                <p className="text-xs text-slate-600 mt-1">Select items from the right panel catalog to start an order</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className={`relative rounded-xl ${activeMenuId === item.cartItemId ? 'z-20' : ''}`}
                >
                  {swipingItem?.cartItemId === item.cartItemId && swipingItem.offset < 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.cartItemId)}
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
                        handleRemoveItem(item.cartItemId);
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
                  {/* LEFT COLUMN: Image & Item Details */}
                  <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-11 h-11 rounded-lg object-cover bg-slate-800 border border-slate-700/50 shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-slate-100 truncate">{item.name}</h4>

                      {/* Display Size Tag & Add-Ons as Vertical Column Stack */}
                      <div className="mt-1 space-y-0.5">
                        {/* Size indicator */}
                        <div className="text-[11px] text-slate-400 font-medium flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                          <span>Size: <strong className="text-slate-200 font-semibold">{item.size}</strong></span>
                        </div>

                        {/* Add-Ons Vertical List */}
                        {item.selectedAddOns.length > 0 && (
                          <div className="space-y-0.5 pt-0.5">
                            {item.selectedAddOns.map((addon) => {
                              const displayName = addon.name.length > 15 
                                ? addon.name.slice(0, 15) + '...' 
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

                        {/* Notes line */}
                        {item.notes && (
                          <div className="text-[11px] text-amber-300/90 italic bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 mt-1 max-w-[170px] truncate">
                            NOTE: {item.notes.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Price & Edit with Quantity directly below */}
                  <div className="flex flex-col items-end shrink-0 gap-2">
                    {/* Top Row: Price Total & Edit Button */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-slate-100">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>

                      {/* ITEM ACTIONS */}
                      <div className="relative item-action-menu">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === item.cartItemId ? null : item.cartItemId);
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

                        {/* POPOVER DROPDOWN MENU */}
                        {activeMenuId === item.cartItemId && (
                          <div className="absolute right-0 top-7 w-44 bg-[#1a233a] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => openModal('SIZE', item)}
                              className="w-full text-left px-3 py-1.5 text-[11px] text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 flex items-center space-x-2 transition-colors"
                            >
                              <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                              <span>Change Size</span>
                            </button>
                            
                            <button
                              onClick={() => openModal('ADDONS', item)}
                              className="w-full text-left px-3 py-1.5 text-[11px] text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 flex items-center space-x-2 transition-colors"
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Add Ons</span>
                            </button>

                            <button
                              onClick={() => openModal('NOTES', item)}
                              className="w-full text-left px-3 py-1.5 text-[11px] text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 flex items-center space-x-2 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>Notes</span>
                            </button>

                            <div className="my-1 border-t border-slate-700/50"></div>

                            <button
                              onClick={() => handleRemoveItem(item.cartItemId)}
                              className="w-full text-left px-3 py-1.5 text-[11px] text-red-400 hover:bg-red-500/20 hover:text-red-300 flex items-center space-x-2 transition-colors font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Item</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Quantity Controls */}
                    <div className="flex items-center bg-[#0b101d]/80 border border-slate-700/60 rounded-lg p-0.5">
                      <button 
                        onPointerDown={() => startQuantityLongPress(item)}
                        onPointerUp={endQuantityLongPress}
                        onPointerLeave={endQuantityLongPress}
                        onPointerCancel={endQuantityLongPress}
                        onClick={() => handleQuantityButtonClick(item, -1)}
                        className="min-h-8 min-w-8 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        aria-label={`Decrease ${item.name} quantity or hold to enter quantity`}
                        title="Hold to enter quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-200">{item.quantity}</span>
                      <button 
                        onPointerDown={() => startQuantityLongPress(item)}
                        onPointerUp={endQuantityLongPress}
                        onPointerLeave={endQuantityLongPress}
                        onPointerCancel={endQuantityLongPress}
                        onClick={() => handleQuantityButtonClick(item, 1)}
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

          {/* Order Total & Checkout */}
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
                    onChange={(event) => setPromoCode(event.target.value)}
                    placeholder="Promo code (e.g. SAVE10)"
                    disabled={cart.length === 0}
                    className="w-full bg-[#182238] border border-slate-700/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={togglePromo}
                  disabled={cart.length === 0}
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
                  <button onClick={togglePromo} className="hover:text-emerald-200">
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
                onClick={() => setCart([])}
                className="col-span-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={() => {
                  if (cart.length > 0) {
                    setModalType(orderType === 'Delivery' ? 'DELIVERY_DETAILS' : 'PAYMENT');
                  }
                }}
                disabled={cart.length === 0}
                className={`col-span-5 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg ${
                  cart.length > 0 
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: PRODUCT CATALOG & GRID */}
        <div className="flex-1 flex flex-col min-h-[70vh] md:h-full bg-[#0b101d] overflow-hidden p-3 sm:p-4 space-y-4">
          
          {/* Top Filter & Search Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="text"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131b2e] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button className="p-2.5 bg-[#131b2e] border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar shrink-0">
            {[
              { id: 'All Items', icon: Sparkles },
              { id: 'Coffee', icon: Coffee },
              { id: 'Drinks', icon: CupSoda },
              { id: 'Bakery', icon: Cookie },
              { id: 'Meals', icon: Utensils }
            ].map(cat => {
              const CategoryIcon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'bg-[#131b2e] text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  <CategoryIcon className="w-3.5 h-3.5" />
                  <span>{cat.id}</span>
                </button>
              );
            })}
          </div>

          {/* Header Item Count Info */}
          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-sm font-bold text-slate-200 tracking-wide">
              {selectedCategory}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {filteredProducts.length} products available
            </span>
          </div>

          {/* Catalog Products Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="bg-[#131b2e] border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/10 group relative overflow-hidden"
                >
                  {/* Badge Tag */}
                  {product.tag && (
                    <span className={`absolute top-4 right-4 ${product.tagColor || 'bg-blue-600'} text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10 shadow-md`}>
                      {product.tag}
                    </span>
                  )}

                  {/* Image */}
                  <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-900 mb-2.5 relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-extrabold text-blue-400">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{product.stock} in stock</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Status Bar */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
            <span>Prices in Philippine pesos (PHP)</span>
            <span className="text-emerald-500 font-medium flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Fresh & Quality Assured</span>
            </span>
          </div>

        </div>

      </div>

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
              {SIZE_OPTIONS.map((sz) => {
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
              {ADD_ON_OPTIONS.map((addon) => {
                const isChecked = activeCartItem.selectedAddOns?.some(a => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    aria-pressed={isChecked}
                    onClick={() => {
                      const currentAddOns = activeCartItem.selectedAddOns || [];
                      const updated = isChecked
                        ? currentAddOns.filter(a => a.id !== addon.id)
                        : [...currentAddOns, addon];
                      setActiveCartItem({ ...activeCartItem, selectedAddOns: updated });
                    }}
                    className={`w-full min-h-16 flex flex-col items-start justify-between gap-2 p-2 rounded-xl border text-[11px] font-semibold text-left transition-all ${
                      isChecked 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                        : 'bg-[#1e293b]/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="leading-tight">{addon.name}</span>
                    <span className="text-xs text-blue-400 font-bold">
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
                        <p className="break-words text-[9px]">NOTE: {item.notes.toUpperCase()}</p>
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

    </div>
  );
}