export const seedCategories = ['Coffee', 'Drinks', 'Bakery', 'Meals'];

export const seedProducts = [
  { id: 'p1', name: 'Espresso Double', category: 'Coffee', price: 3.50, stock: 45, tag: 'Popular', tagColor: 'bg-indigo-600', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400', defaultSize: 'Single shot', defaultAddOns: [] },
  { id: 'p2', name: 'Iced Latte', category: 'Coffee', price: 4.75, stock: 32, tag: null, tagColor: null, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400', defaultSize: 'Regular', defaultAddOns: [] },
  { id: 'p3', name: 'Caramel Macchiato', category: 'Coffee', price: 5.25, stock: 20, tag: 'Hot', tagColor: 'bg-red-500', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400', defaultSize: 'Large', defaultAddOns: ['sugar_50'] },
  { id: 'p4', name: 'Cappuccino', category: 'Coffee', price: 4.25, stock: 18, tag: null, tagColor: null, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400', defaultSize: 'Regular', defaultAddOns: [] },
  { id: 'p5', name: 'Butter Croissant', category: 'Bakery', price: 3.00, stock: 15, tag: 'Fresh', tagColor: 'bg-emerald-500', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400', defaultSize: 'Regular', defaultAddOns: [] },
  { id: 'p6', name: 'Avocado Toast', category: 'Meals', price: 8.50, stock: 12, tag: null, tagColor: null, image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&q=80&w=400', defaultSize: 'Standard', defaultAddOns: [] },
  { id: 'p7', name: 'Club Sandwich', category: 'Meals', price: 9.75, stock: 8, tag: null, tagColor: null, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400', defaultSize: 'Full', defaultAddOns: [] },
  { id: 'p8', name: 'Blueberry Muffin', category: 'Bakery', price: 3.50, stock: 24, tag: null, tagColor: null, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=400', defaultSize: 'Regular', defaultAddOns: [] },
  { id: 'p9', name: 'Matcha Green Tea', category: 'Drinks', price: 5.00, stock: 30, tag: null, tagColor: null, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=400', defaultSize: 'Medium', defaultAddOns: [] },
  { id: 'p10', name: 'Fresh Orange Juice', category: 'Drinks', price: 4.50, stock: 25, tag: null, tagColor: null, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400', defaultSize: 'Regular', defaultAddOns: [] },
  { id: 'p11', name: 'Pepperoni Slice', category: 'Meals', price: 4.25, stock: 14, tag: null, tagColor: null, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400', defaultSize: '1 Slice', defaultAddOns: [] },
  { id: 'p12', name: 'Chocolate Brownie', category: 'Bakery', price: 3.75, stock: 19, tag: 'Popular', tagColor: 'bg-indigo-600', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400', defaultSize: 'Piece', defaultAddOns: [] },
  { id: 'p13', name: 'Sparkling Water', category: 'Drinks', price: 2.25, stock: 50, tag: null, tagColor: null, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400', defaultSize: '500ml', defaultAddOns: [] },
  { id: 'p14', name: 'Classic Burger', category: 'Meals', price: 10.50, stock: 10, tag: 'Chef Special', tagColor: 'bg-amber-500', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', defaultSize: 'Single Patty', defaultAddOns: [] },
  { id: 'p15', name: 'Iced Tea Lemon', category: 'Drinks', price: 3.75, stock: 28, tag: null, tagColor: null, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400', defaultSize: 'Regular', defaultAddOns: [] },
];

export const seedSizeOptions = [
  { id: 'small', name: 'Small', adjustment: -0.50 },
  { id: 'regular', name: 'Regular', adjustment: 0 },
  { id: 'large', name: 'Large', adjustment: 0.75 },
  { id: 'xlarge', name: 'X-Large', adjustment: 1.25 },
];

export const seedAddOns = [
  { id: 'extra_shot', name: 'Extra Espresso Shot', price: 1.00 },
  { id: 'caramel_syrup', name: 'Caramel Syrup', price: 0.50 },
  { id: 'vanilla_syrup', name: 'Vanilla Syrup', price: 0.50 },
  { id: 'almond_milk', name: 'Almond Milk', price: 0.75 },
  { id: 'oat_milk', name: 'Oat Milk', price: 0.75 },
  { id: 'whipped_cream', name: 'Whipped Cream', price: 0.60 },
  { id: 'less_ice', name: 'Less Ice', price: 0 },
  { id: 'sugar_50', name: '50% Sugar', price: 0 },
];
