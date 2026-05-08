export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Main Dish' | 'Drink' | 'Breakfast' | 'Snacks';
  image: string;
  isSpicy?: boolean;
  isChefSpecial?: boolean;
  rating?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface Stat {
  label: string;
  value: string;
  icon: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  type: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}
