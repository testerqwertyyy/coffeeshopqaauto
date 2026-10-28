export interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  roastLevel: 'light' | 'medium' | 'dark';
  price: number;
  weight: string;
  description: string;
  flavorNotes: string[];
  altitude: string;
  process: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  items: CartItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  date: string;
}
