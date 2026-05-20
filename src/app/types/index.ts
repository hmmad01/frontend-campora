/**
 * @file index.ts (types)
 * @description Definisi tipe data global (shared interfaces) yang digunakan di seluruh aplikasi (seperti Product, Review, Package, dll).
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;       // per day in IDR
  rating: number;
  reviews: number;
  image: string;
  available: boolean;
  description?: string;
  features?: string[];
  brand?: string;
}

export interface Review {
  id: number;
  name: string;
  trip: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface Package {
  id: string;
  title: string;
  image: string;
  description: string;
  items: string[];
  price: number;
  featured?: boolean;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}
