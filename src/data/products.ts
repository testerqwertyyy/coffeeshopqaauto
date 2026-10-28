import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Ethiopia Yirgacheffe',
    origin: 'Ethiopia',
    category: 'light',
    roastLevel: 'light',
    price: 24.99,
    weight: '250g',
    description: 'A stunning single-origin coffee from the birthplace of coffee. This Yirgacheffe lot showcases delicate floral aromatics with a bright, tea-like body. Grown at extreme altitude by smallholder farmers in the Gedeo zone.',
    flavorNotes: ['Jasmine', 'Bergamot', 'Peach', 'Honey'],
    altitude: '1,900 - 2,200m',
    process: 'Washed',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    name: 'Colombia Huila',
    origin: 'Colombia',
    category: 'medium',
    roastLevel: 'medium',
    price: 21.99,
    weight: '250g',
    description: 'From the lush mountains of Huila department, this coffee delivers a perfectly balanced cup. Grown by the Acevedo family at their micro-mill, it showcases the terroir of one of Colombia\'s finest growing regions.',
    flavorNotes: ['Caramel', 'Red Apple', 'Milk Chocolate', 'Walnut'],
    altitude: '1,600 - 1,800m',
    process: 'Washed',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    name: 'Kenya AA Nyeri',
    origin: 'Kenya',
    category: 'light',
    roastLevel: 'light',
    price: 28.99,
    weight: '250g',
    description: 'A premium AA grade lot from the red volcanic soils of Nyeri county. This coffee is processed at the famed Kiangombe factory and delivers an explosively complex cup with vibrant acidity and deep fruit sweetness.',
    flavorNotes: ['Blackcurrant', 'Grapefruit', 'Tomato', 'Brown Sugar'],
    altitude: '1,700 - 1,900m',
    process: 'Washed',
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop'
  },
  {
    id: 4,
    name: 'Brazil Santos Natural',
    origin: 'Brazil',
    category: 'medium',
    roastLevel: 'medium',
    price: 18.99,
    weight: '250g',
    description: 'A classic Brazilian natural process coffee from the Cerrado Mineiro region. Sun-dried on raised beds for 21 days, this coffee offers a smooth, sweet cup with low acidity and a velvety body perfect for espresso.',
    flavorNotes: ['Hazelnut', 'Dark Chocolate', 'Dried Fig', 'Vanilla'],
    altitude: '1,000 - 1,200m',
    process: 'Natural',
    image: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=400&h=400&fit=crop'
  },
  {
    id: 5,
    name: 'Guatemala Antigua',
    origin: 'Guatemala',
    category: 'dark',
    roastLevel: 'dark',
    price: 22.99,
    weight: '250g',
    description: 'Grown in the shadow of three volcanoes in the Antigua Valley, this coffee benefits from rich volcanic soil and a unique microclimate. Dark roasted to bring out deep, smoky sweetness with a full body.',
    flavorNotes: ['Dark Cocoa', 'Smoky', 'Spice', 'Molasses'],
    altitude: '1,500 - 1,700m',
    process: 'Washed',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop'
  },
  {
    id: 6,
    name: 'Costa Rica Tarrazú',
    origin: 'Costa Rica',
    category: 'dark',
    roastLevel: 'dark',
    price: 23.99,
    weight: '250g',
    description: 'From the renowned Tarrazú region at the heart of Costa Rica, this honey-processed coffee is roasted dark to develop rich, complex flavors. The high altitude and volcanic soil create an exceptionally clean cup with remarkable depth.',
    flavorNotes: ['Toffee', 'Roasted Almond', 'Cherry', 'Cane Sugar'],
    altitude: '1,400 - 1,700m',
    process: 'Honey',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop'
  }
];

export const categories = [
  { id: 'all', label: 'All Coffees' },
  { id: 'light', label: 'Light Roast' },
  { id: 'medium', label: 'Medium Roast' },
  { id: 'dark', label: 'Dark Roast' }
];
