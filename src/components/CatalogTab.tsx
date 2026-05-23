import React, { useState, useEffect } from 'react';
import { Search, Monitor, Laptop, Filter, ShoppingBag, Eye, X, AlertCircle } from 'lucide-react';
import { Product } from '../types';

const staticProducts: Product[] = []; // Fallback static products if backend unavailable

export default function CatalogTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Custom item specification modal
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('API server unreachable.');
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        console.warn("Backend API offline. Swapping architecture layout to static database fallback module.");
        // Apply the static fallback list cleanly
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);
}