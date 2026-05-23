export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  specs: string;
  stock: number;
  image?: string;
}

export interface Repair {
  id: number;
  tracking_number: string;
  client_name: string;
  contact: string;
  device: string;
  status: 'Pending' | 'Diagnosis' | 'In Progress' | 'Ready for Pickup' | 'Completed';
  issue: string;
  cost: number;
  created_at: string;
}

export interface PCPart {
  id: number;
  part_name: string;
  type: 'CPU' | 'GPU' | 'Motherboard' | 'RAM' | 'Storage' | 'PSU' | 'Case' | 'Cooler';
  price: number;
  brand: string;
  specs: string;
  watts: number;
}

export interface SqlQueryResult {
  columns: string[];
  rows: any[];
  affectedRows?: number;
  error?: string;
}
