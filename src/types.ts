export type CategoryType = 'Phones' | 'Laptops' | 'Home Appliances' | 'Shoes/Clothes';

export interface Product {
  id: string;
  category: CategoryType;
  brand: string;
  model: string;
  specifications: string[];
  price: number; // In GHS (Ghana Cedis)
  stockStatus: 'In Stock' | 'Out of Stock';
  imageUrl: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomImportRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  description: string;
  budget: number;
  imageLink?: string;
  location?: {
    latitude: number;
    longitude: number;
    mapsUrl?: string;
  };
  timestamp: string;
}

export interface CustomerOrder {
  id: string;
  name: string;
  phone: string;
  email?: string;
  items: {
    productTitle: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  location?: {
    latitude: number;
    longitude: number;
    mapsUrl?: string;
  };
  timestamp: string;
  status?: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}
