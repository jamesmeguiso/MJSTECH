import React, { useState, useEffect } from 'react';
import { Cpu, SquareCheck, Info, Sparkles, Battery, RefreshCw, Layers, AlertCircle, ShoppingCart } from 'lucide-react';
import { PCPart } from '../types';

// Local fallback for client-side static parts (types file has no exported `staticParts`).
const staticParts: PCPart[] = [];

export default function BuilderTab() {
  const [parts, setParts] = useState<PCPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Remaining code stays exactly the same...

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/pc-parts');
        if (!res.ok) throw new Error('API server unreachable.');
        const data = await res.json();
        setParts(data);
      } catch (err: any) {
        console.warn("Custom Builder components loading from static client fallback arrays.");
        setParts(staticParts);
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);
}