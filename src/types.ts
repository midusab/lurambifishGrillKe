export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Main Dish' | 'Drink' | 'Breakfast' | 'Snacks';
  image: string;
  isSpicy?: boolean;
  isChefSpecial?: boolean;
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
