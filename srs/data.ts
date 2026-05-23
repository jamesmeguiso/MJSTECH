// Local type definitions to avoid external './types' import
export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  specs: string;
  stock: number;
  image: string;
};

export type PCPart = {
  id: number;
  part_name: string;
  type: string;
  price: number;
  brand: string;
  specs: string;
  watts: number;
};

export const staticProducts: Product[] = [
  {
    id: 1,
    name: "MJSTECH ProBook Horizon 15",
    category: "Laptop",
    price: 42500,
    specs: "AMD Ryzen 7 5700U\n16GB DDR4 RAM\n512GB NVMe M.2 SSD\n15.6\" FHD IPS Display\nWindows 11 Pro Licensed",
    stock: 8,
    image: ""
  },
  {
    id: 2,
    name: "Apex Vanguard Custom Desktop",
    category: "Desktop",
    price: 58900,
    specs: "Intel Core i5-13400F\nNVIDIA RTX 4060 8GB\n16GB Kingston Fury 3600MHz\n1TB Kingston NV2 SSD\n650W 80+ Bronze PSU\nPremium High-Airflow Mesh Case",
    stock: 3,
    image: ""
  },
  {
    id: 3,
    name: "MJSTECH Stealth Elite Notebook",
    category: "Laptop",
    price: 64999,
    specs: "Intel Core i7-12700H\nNVIDIA RTX 3050 Ti Graphics\n32GB DDR5 Dual Channel RAM\n1TB Samsung EVO Gen4 SSD\n14\" 120Hz QHD Display",
    stock: 5,
    image: ""
  }
];

export const staticParts: PCPart[] = [
  { id: 1, part_name: "AMD Ryzen 5 5600X", type: "CPU", price: 8200, brand: "AMD", specs: "6 Cores, 12 Threads, 3.7GHz Base, 4.6GHz Boost, 65W TDP", watts: 65 },
  { id: 2, part_name: "Intel Core i5-12400F", type: "CPU", price: 7100, brand: "Intel", specs: "6 Cores, 12 Threads, 2.5GHz Base, 4.4GHz Boost, No iGPU", watts: 65 },
  { id: 3, part_name: "NVIDIA RTX 4060 Ti (ASUS Dual)", type: "GPU", price: 24500, brand: "NVIDIA", specs: "8GB GDDR6 VRAM, DLSS 3.0, Dual Fan Design", watts: 160 },
  { id: 4, part_name: "AMD Radeon RX 7600 XT", type: "GPU", price: 19800, brand: "AMD", specs: "16GB GDDR6 VRAM, RDNA 3 Architecture", watts: 190 },
  { id: 5, part_name: "MSI B550M Pro-VDH WiFi", type: "Motherboard", price: 6200, brand: "MSI", specs: "AM4 Socket, Micro-ATX, PCIe 4.0, Dual M.2 Slots", watts: 40 },
  { id: 6, part_name: "GIGABYTE B760M DS3H AX", type: "Motherboard", price: 7400, brand: "GIGABYTE", specs: "LGA1700 Socket, DDR4, Micro-ATX, Dual NVMe Slots, Built-In WiFi", watts: 50 },
  { id: 7, part_name: "Corsair Vengeance LPX 16GB Kit", type: "RAM", price: 2600, brand: "Corsair", specs: "16GB (2 x 8GB) DDR4 3200MHz CL16 Performance Memory", watts: 10 },
  { id: 8, part_name: "Kingston Fury Beast 32GB Kit", type: "RAM", price: 5400, brand: "Kingston", specs: "32GB (2 x 16GB) DDR4 3600MHz High-Performance Gaming Memory", watts: 15 },
  { id: 9, part_name: "Crucial P3 Plus 1TB NVMe", type: "Storage", price: 3800, brand: "Crucial", specs: "1TB M.2 PCIe Gen4 x4 NVMe SSD, Up to 5000MB/s Sequential Reads", watts: 5 },
  { id: 10, part_name: "Samsung 980 Pro 2TB", type: "Storage", price: 9200, brand: "Samsung", specs: "2TB M.2 NVMe PCIe Gen4, Heatsink Variant, Up to 7000MB/s", watts: 7 },
  { id: 11, part_name: "Corsair CV650 650W PSU", type: "PSU", price: 3400, brand: "Corsair", specs: "650 Watts, 80 Plus Bronze Certified, Fixed Sleeved Cables", watts: 0 },
  { id: 12, part_name: "Seasonic Focus GX-750 Gold", type: "PSU", price: 6800, brand: "Seasonic", specs: "750 Watts, 80 Plus Gold Certified, Fully Modular Architecture", watts: 0 },
  { id: 13, part_name: "Montech Air 100 Lite Mesh", type: "Case", price: 2350, brand: "Montech", specs: "Micro-ATX Tower, High Airflow Mesh Front Panel, 2x 120mm Fans Included", watts: 0 },
  { id: 14, part_name: "Deepcool AK400 Digital", type: "Cooler", price: 1650, brand: "Deepcool", specs: "Single Tower CPU Air Cooler, Real-Time Status Screen display, ARGB Fan", watts: 5 }
];