import { useState, useEffect, useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import AppHeader from './components/AppHeader';
import CartItemCard from './components/CartItemCard';
import OrderModals from './components/OrderModals';
import OrderSummary from './components/OrderSummary';
import OrderTypeHeader from './components/OrderTypeHeader';
import ProductCatalog from './components/ProductCatalog';
import { ADD_ON_OPTIONS, CATALOG_PRODUCTS, SIZE_OPTIONS } from './data';
import type { AddOn, CartItem, ModalType, Product } from './types';

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
      
      <AppHeader currentTime={currentTime} />

      {/* MAIN BODY: LEFT ORDER PANEL & RIGHT CATALOG GRID */}
      <div className="flex flex-1 flex-col overflow-visible md:flex-row md:overflow-hidden">
        
        {/* LEFT PANEL: ORDER LIST & CALCULATIONS */}
        <div className="w-full bg-[#131b2e]/90 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col min-h-[65vh] md:min-h-0 md:w-[430px] md:h-full shrink-0 shadow-2xl relative z-10">
          
          <OrderTypeHeader
            customerType={customerType}
            onCustomerChange={setCustomerType}
            orderType={orderType}
            onOrderTypeChange={setOrderType}
          />

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <ShoppingBag className="w-12 h-12 mb-3 stroke-[1.5] text-slate-600" />
                <p className="text-sm font-medium text-slate-400">Order list is empty</p>
                <p className="text-xs text-slate-600 mt-1">Select items from the right panel catalog to start an order</p>
              </div>
            ) : (
              cart.map((item) => (
                <CartItemCard
                  key={item.cartItemId}
                  item={item}
                  activeMenu={activeMenuId === item.cartItemId}
                  onToggleMenu={() => setActiveMenuId(activeMenuId === item.cartItemId ? null : item.cartItemId)}
                  onEdit={openModal}
                  onRemove={handleRemoveItem}
                  swipingItem={swipingItem}
                  setSwipingItem={setSwipingItem}
                  swipeStart={swipeStart}
                  onStartQuantityLongPress={startQuantityLongPress}
                  onEndQuantityLongPress={endQuantityLongPress}
                  onQuantityChange={(changedItem, delta) => handleQuantityButtonClick(changedItem, delta)}
                />
              ))
            )}
          </div>

          <OrderSummary
            cartCount={cart.length}
            orderType={orderType}
            promoActive={promoActive}
            originalTotalAmount={originalTotalAmount}
            totalAmount={totalAmount}
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            onTogglePromo={togglePromo}
            onCancelOrder={() => setCart([])}
            onCheckout={() => {
              if (cart.length > 0) {
                setModalType(orderType === 'Delivery' ? 'DELIVERY_DETAILS' : 'PAYMENT');
              }
            }}
          />
        </div>

        <ProductCatalog
          products={filteredProducts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddToCart={handleAddToCart}
        />

      </div>

      <OrderModals
        modalType={modalType}
        setModalType={setModalType}
        deliveryApp={deliveryApp}
        setDeliveryApp={setDeliveryApp}
        otherDeliveryApp={otherDeliveryApp}
        setOtherDeliveryApp={setOtherDeliveryApp}
        deliveryOrderNumber={deliveryOrderNumber}
        setDeliveryOrderNumber={setDeliveryOrderNumber}
        deliveryDetailsValid={deliveryDetailsValid}
        activeCartItem={activeCartItem}
        setActiveCartItem={setActiveCartItem}
        quantityInput={quantityInput}
        setQuantityInput={setQuantityInput}
        saveQuantity={saveQuantity}
        saveItemChanges={saveItemChanges}
        sizeOptions={SIZE_OPTIONS}
        addOnOptions={ADD_ON_OPTIONS}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        subtotal={subtotal}
        promoActive={promoActive}
        discountAmount={discountAmount}
        taxAmount={taxAmount}
        totalAmount={totalAmount}
        cardLastFour={cardLastFour}
        setCardLastFour={setCardLastFour}
        cashReceived={cashReceived}
        setCashReceived={setCashReceived}
        cashReceivedAmount={cashReceivedAmount}
        walletReference={walletReference}
        setWalletReference={setWalletReference}
        paymentDetailsValid={paymentDetailsValid}
        orderType={orderType}
        deliveryAppName={deliveryAppName}
        cart={cart}
        setCart={setCart}
        currentTime={currentTime}
      />
    </div>
  );
}