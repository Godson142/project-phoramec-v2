import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // PHONES SECTION
  {
    id: 'phone-1',
    category: 'Phones',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    specifications: ['256GB Storage', '8GB RAM', 'A17 Pro Chip', 'Natural Titanium'],
    price: 18500,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
    description: 'Apple iPhone 15 Pro Max, Natural Titanium with 256 Gigabytes storage, A17 Pro Chip.'
  },
  {
    id: 'phone-2',
    category: 'Phones',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    specifications: ['512GB Storage', '12GB RAM', 'Snapdragon 8 Gen 3', 'Titanium Black'],
    price: 17200,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80',
    description: 'Samsung Galaxy S24 Ultra, Titanium Black with 512 Gigabytes storage and Snapdragon 8 Gen 3.'
  },
  {
    id: 'phone-3',
    category: 'Phones',
    brand: 'Tecno',
    model: 'Camon 30 Pro 5G',
    specifications: ['256GB Storage', '12GB RAM', 'Dimensity 8200 Ultra', 'Icelandic Blue'],
    price: 4800,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    description: 'Tecno Camon 30 Pro 5G, Icelandic Blue with 256 Gigabytes storage and 12 Gigabytes RAM.'
  },
  {
    id: 'phone-4',
    category: 'Phones',
    brand: 'Apple',
    model: 'iPhone 13',
    specifications: ['128GB Storage', '4GB RAM', 'A15 Bionic', 'Midnight Black'],
    price: 8900,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80',
    description: 'Apple iPhone 13, Midnight Black with 128 Gigabytes storage, A15 Bionic chip.'
  },
  {
    id: 'phone-5',
    category: 'Phones',
    brand: 'Samsung',
    model: 'Galaxy A55 5G',
    specifications: ['256GB Storage', '8GB RAM', 'Exynos 1480', 'Awesome Lilac'],
    price: 5200,
    stockStatus: 'Out of Stock',
    imageUrl: 'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=500&auto=format&fit=crop&q=80',
    description: 'Samsung Galaxy A55 5G, Awesome Lilac with 256 Gigabytes storage. Currently Sold Out.'
  },

  // LAPTOPS SECTION
  {
    id: 'laptop-1',
    category: 'Laptops',
    brand: 'HP',
    model: 'Pavilion 15',
    specifications: ['Intel Core i7', '16GB RAM', '512GB SSD', 'Windows 11 Touchscreen'],
    price: 11500,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=500&auto=format&fit=crop&q=80',
    description: 'HP Pavilion 15 touchscreen laptop, Core i7, 16 Gigabytes RAM, 512 Gigabyte Solid State Drive.'
  },
  {
    id: 'laptop-2',
    category: 'Laptops',
    brand: 'Dell',
    model: 'Latitude 5440',
    specifications: ['Intel Core i5 13th Gen', '16GB RAM', '512GB SSD', 'Business Grade Rugged'],
    price: 12800,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80',
    description: 'Dell Latitude 5440, rugged business laptop, Core i5 13th Gen, 16 Gigabytes RAM.'
  },
  {
    id: 'laptop-3',
    category: 'Laptops',
    brand: 'Lenovo',
    model: 'ThinkPad L14 Gen 4',
    specifications: ['AMD Ryzen 5 Pro', '16GB RAM', '512GB SSD', 'TrackPoint Keyboard'],
    price: 10400,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80',
    description: 'Lenovo ThinkPad L14 Gen 4, Ryzen 5 Pro processor, 16 Gigabytes RAM, famous durable trackpoint keyboard.'
  },
  {
    id: 'laptop-4',
    category: 'Laptops',
    brand: 'Apple',
    model: 'MacBook Air M3',
    specifications: ['Apple M3 Chip', '8GB Unified Memory', '256GB SSD', 'Space Grey', 'Super Thin'],
    price: 16900,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
    description: 'Apple MacBook Air with M3 chip, 8 Gigabytes unified memory, 256 Gigabytes SSD, Space Grey.'
  },
  {
    id: 'laptop-5',
    category: 'Laptops',
    brand: 'HP',
    model: 'Student Chromebook 14',
    specifications: ['Intel Celeron', '4GB RAM', '64GB eMMC', 'Chrome OS', 'Budget Friendly'],
    price: 2950,
    stockStatus: 'Out of Stock',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80',
    description: 'HP Student Chromebook 14, 4 Gigabytes RAM, Chrome OS. Currently Out of Stock.'
  },

  // HOME APPLIANCES SECTION
  {
    id: 'appliance-1',
    category: 'Home Appliances',
    brand: 'Samsung',
    model: 'UHD 4K Smart TV 55"',
    specifications: ['55 Inch Display', 'Crystal Processor 4K', 'Tizen OS', 'HDMI/USB Ports'],
    price: 9400,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop&q=80',
    description: 'Samsung 55 Inch Smart TV, Ultra High Definition 4K display, Crystal Processor.'
  },
  {
    id: 'appliance-2',
    category: 'Home Appliances',
    brand: 'Nasco',
    model: 'Double Door Fridge 260L',
    specifications: ['260 Litres Capacity', 'Low Noise', 'Energy Saving LED', 'No Frost Engine'],
    price: 6800,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1571175480736-a3b6aa121d5c?w=500&auto=format&fit=crop&q=80',
    description: 'Nasco Double Door Fridge, 260 Litres Capacity, energy-saving design with premium cooling.'
  },
  {
    id: 'appliance-3',
    category: 'Home Appliances',
    brand: 'Philips',
    model: 'Airfryer XL Essential',
    specifications: ['4.1L Capacity', 'Rapid Air Technology', '12-in-1 Cooking', 'NutriU App Recipes'],
    price: 2450,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500&auto=format&fit=crop&q=80',
    description: 'Philips Airfryer XL Essential, 4.1 Litres capacity with Rapid Air healthy cooking technology.'
  },
  {
    id: 'appliance-4',
    category: 'Home Appliances',
    brand: 'Binatone',
    model: 'Heavy Weight Dry Iron',
    specifications: ['Non-Stick Soleplate', '1000 Watts Power', 'Fabric Selector Dial', 'Comfort Grip Handle'],
    price: 650,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1622390815183-b78f4604928b?w=500&auto=format&fit=crop&q=80',
    description: 'Binatone Heavy Weight Dry Iron, non-stick soleplate, perfect for quick crisp Ghanaian clothing starch pressing.'
  },

  // SHOES/CLOTHES SECTION
  {
    id: 'fashion-1',
    category: 'Shoes/Clothes',
    brand: 'Nike',
    model: 'Air Max Alpha Sneakers',
    specifications: ['Breathable Mesh', 'Air Cushioning', 'Durable Traction', 'Sporty Black & White'],
    price: 1850,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
    description: 'Nike Air Max Alpha Sneakers, athletic sports shoes with air cushioning padding.'
  },
  {
    id: 'fashion-2',
    category: 'Shoes/Clothes',
    brand: 'Zara',
    model: 'Linen Button-Up Shirt',
    specifications: ['100% Breathable Linen', 'Slim Fit', 'Beige Melange Color', 'Perfect for Warm Weather'],
    price: 680,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80',
    description: 'Zara Linen Button-Up Shirt, 100% breathable beige linen fabric, perfect for the Accra heat.'
  },
  {
    id: 'fashion-3',
    category: 'Shoes/Clothes',
    brand: 'Adidas',
    model: 'Grand Court Leather Shoes',
    specifications: ['Genuine Leather Upper', 'Cloudfoam Comfort Sockliner', 'Retro 3-Stripes Design'],
    price: 1620,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=80',
    description: 'Adidas Grand Court Leather Shoes, premium white finish with classic three stripes.'
  },
  {
    id: 'fashion-4',
    category: 'Shoes/Clothes',
    brand: 'Clarks',
    model: 'Classic Leather Loafers',
    specifications: ['Soft Suede Finish', 'Comfort Ortholite Cushion', 'Slip-on Styling', 'Rich Tan Brown'],
    price: 2100,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=500&auto=format&fit=crop&q=80',
    description: 'Clarks Classic Leather Loafers, rich tan brown soft suede finish.'
  }
];

export const CATEGORIES_METADATA = [
  {
    id: 'cat-phones',
    title: 'Phones',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    description: 'Apple, Samsung, Tecno, and other high-quality smartphones.'
  },
  {
    id: 'cat-laptops',
    title: 'Laptops',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    description: 'HP, Dell, Lenovo, and MacBooks for work, study, and creative tasks.'
  },
  {
    id: 'cat-appliances',
    title: 'Home Appliances',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80',
    description: 'Smart TVs, refrigerators, airfryers, and essential domestic gadgets.'
  },
  {
    id: 'cat-fashion',
    title: 'Shoes/Clothes',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80',
    description: 'Sneakers, shirts, loafers, and warm-weather fashion essentials.'
  }
];

export const WHATSAPP_NUMBER = '233551525354'; // Authentic Ghana format for the target number
export const OFFICE_CONTACT = '+233 55 152 5354';
export const SEC_PASSWORD = 'admin'; // Plain password for validation
