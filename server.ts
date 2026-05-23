import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import alasql from "alasql";

// Start Express
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // -------------------------------------------------------------
  // DATABASE INITIALIZATION & SEEDING (SQL Database via AlaSQL)
  // -------------------------------------------------------------
  console.log("Initializing SQL Database...");
  
  try {
    // Drop existing tables just in case
    alasql("DROP TABLE IF EXISTS products");
    alasql("DROP TABLE IF EXISTS pc_parts");
    alasql("DROP TABLE IF EXISTS repairs");

    // Create products table
    alasql(`
      CREATE TABLE products (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name STRING,
        category STRING,
        price INT,
        specs STRING,
        stock INT,
        image STRING
      )
    `);

    // Create pc_parts table for Custom PC Builder
    alasql(`
      CREATE TABLE pc_parts (
        id INT IDENTITY(1,1) PRIMARY KEY,
        part_name STRING,
        type STRING,
        price INT,
        brand STRING,
        specs STRING,
        watts INT
      )
    `);

    // Create repairs tracking table
    alasql(`
      CREATE TABLE repairs (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tracking_number STRING,
        client_name STRING,
        contact STRING,
        device STRING,
        status STRING,
        issue STRING,
        cost INT,
        created_at STRING
      )
    `);

    // Seed products
    const sampleProducts = [
      { name: "Asus TUF Gaming A15", category: "Laptop", price: 54500, specs: "Ryzen 7 7735HS / RTX 4050 6GB / 16GB DDR5 / 512GB SSD / 144Hz FHD", stock: 5, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
      { name: "Lenovo IdeaPad Slim 3", category: "Laptop", price: 27995, specs: "Intel Core i3-1215U / 8GB DDR4 / 512GB SSD / 15.6\" FHD IPS / Win11", stock: 12, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
      { name: "MJS Office Essentials PC", category: "Desktop", price: 18500, specs: "Intel Core i3-12100 / H610M / 8GB RAM / 256GB SSD / 500W PSU / Basic Case", stock: 8, image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
      { name: "MJS Valkyrie Gaming Rig", category: "Desktop", price: 42995, specs: "AMD Ryzen 5 5600X / RTX 4060 8GB / B550M WiFi / 16GB RAM / 1TB NVMe SSD / 650W PSU / RGB Case", stock: 3, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
      { name: "Gigabyte G5 Gaming Laptop", category: "Laptop", price: 46995, specs: "Intel i5-12500H / RTX 4050 / 8GB DDR4 / 512GB SSD / 144Hz FHD", stock: 4, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
      { name: "MJS Apex Creator Workstation", category: "Desktop", price: 79995, specs: "AMD Ryzen 9 7900X / RTX 4070 Super 12GB / X670 / 32GB DDR5 / 2TB SSD / 850W Gold PSU", stock: 2, image: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
    ];

    sampleProducts.forEach(prod => {
      alasql("INSERT INTO products (name, category, price, specs, stock, image) VALUES (?, ?, ?, ?, ?, ?)", 
        [prod.name, prod.category, prod.price, prod.specs, prod.stock, prod.image]);
    });

    // Seed PC parts for Builder
    const sampleParts = [
      // CPUs
      { part_name: "AMD Ryzen 5 5600X", type: "CPU", price: 7950, brand: "AMD", specs: "6 Cores / 12 Threads, Base 3.7GHz, Socket AM4", watts: 65 },
      { part_name: "AMD Ryzen 7 7800X3D", type: "CPU", price: 23900, brand: "AMD", specs: "8 Cores / 16 Threads, 3D V-Cache, AM5", watts: 120 },
      { part_name: "Intel Core i5-12400F", type: "CPU", price: 6995, brand: "Intel", specs: "6 Cores / 12 Threads, Base 2.5GHz, LGA1700", watts: 65 },
      { part_name: "Intel Core i7-14700K", type: "CPU", price: 24500, brand: "Intel", specs: "20 Cores / 28 Threads, Up to 5.6GHz, LGA1700", watts: 125 },
      
      // GPUs
      { part_name: "Nvidia RTX 4060 Asus Dual 8GB", type: "GPU", price: 18995, brand: "Nvidia", specs: "8GB GDDR6, DLSS 3.0, Dual Fan", watts: 115 },
      { part_name: "Nvidia RTX 4070 Super MSI Ventus 12GB", type: "GPU", price: 39500, brand: "Nvidia", specs: "12GB GDDR6X, Ada Lovelace, Triple Fan", watts: 220 },
      { part_name: "AMD RX 6600 Gigabyte Eagle 8GB", type: "GPU", price: 12995, brand: "AMD", specs: "8GB GDDR6, PCIe 4.0, Low Power", watts: 130 },
      { part_name: "AMD RX 7800 XT Sapphire Pure 16GB", type: "GPU", price: 31995, brand: "AMD", specs: "16GB GDDR6, White Edition, High FPS", watts: 263 },

      // Motherboards
      { part_name: "MSI B550M Pro-VDH WiFi", type: "Motherboard", price: 6150, brand: "MSI", specs: "mATX, AM4, Dual M.2, Built-in WiFi & BT", watts: 15 },
      { part_name: "Gigabyte B760M DS3H AX DDR4", type: "Motherboard", price: 6850, brand: "Gigabyte", specs: "mATX, LGA1700, DDR4 Support, WiFi 6", watts: 15 },
      { part_name: "Asus ROG STRIX B650-A Gaming WiFi", type: "Motherboard", price: 14200, brand: "Asus", specs: "ATX, AM5, DDR5, Silver/White Accent", watts: 20 },

      // RAM
      { part_name: "G.Skill Ripjaws V 16GB (2x8GB) 3200MHz DDR4", type: "RAM", price: 2450, brand: "G.Skill", specs: "Dual Channel Kit, Black Heatsink CL16", watts: 6 },
      { part_name: "Corsair Vengeance RGB 32GB (2x16GB) 6000MHz DDR5", type: "RAM", price: 6995, brand: "Corsair", specs: "DDR5 High Speed, Intel XMP / AMD EXPO", watts: 8 },

      // Storage
      { part_name: "Kingston NV2 1TB PCIe 4.0 NVMe M.2 SSD", type: "Storage", price: 3450, brand: "Kingston", specs: "R/W: Up to 3500/2100 MB/s", watts: 5 },
      { part_name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD", type: "Storage", price: 10995, brand: "Samsung", specs: "Top-tier SSD, R/W: 7450/6900 MB/s", watts: 6 },

      // PSUs
      { part_name: "MSI MAG A650BN 650W 80+ Bronze", type: "PSU", price: 3150, brand: "MSI", specs: "650W Bronze, Reliable Flat Cables", watts: 0 },
      { part_name: "Corsair RM750e 750W 80+ Gold Fully Modular", type: "PSU", price: 6450, brand: "Corsair", specs: "750W Gold, Silent FDB Fan, ATX 3.0", watts: 0 },

      // Cases
      { part_name: "Tecware Nexus Air M (Black/White)", type: "Case", price: 2150, brand: "Tecware", specs: "mATX, Mesh Front, 3x 120mm RGB Fans Included", watts: 0 },
      { part_name: "Montech AIR 903 MAX (ARGB Mesh)", type: "Case", price: 3650, brand: "Montech", specs: "Mid Tower, Excellent Airflow, 4x 140mm High-Performance Fans", watts: 0 },

      // Coolers
      { part_name: "Deepcool AK400 Air Cooler", type: "Cooler", price: 1550, brand: "Deepcool", specs: "4 Performance Heatpipes, 120mm PWM Fan", watts: 5 },
      { part_name: "Deepcool LT520 240mm AIO Liquid Cooler", type: "Cooler", price: 4750, brand: "Deepcool", specs: "Anti-Leak Tech, Premium Infinity Mirror Cap", watts: 15 }
    ];

    sampleParts.forEach(part => {
      alasql("INSERT INTO pc_parts (part_name, type, price, brand, specs, watts) VALUES (?, ?, ?, ?, ?, ?)",
        [part.part_name, part.type, part.price, part.brand, part.specs, part.watts]);
    });

    // Seed Repairs
    const sampleRepairs = [
      { tracking_number: "MJS-REP-4952", client_name: "John Doe", contact: "09123456789", device: "Asus ROG Zephyrus G14", status: "Ready for Pickup", issue: "Liquid Metal cleaning, fan replacement & full system thermal repasting", cost: 2400, created_at: "2026-05-20" },
      { tracking_number: "MJS-REP-1005", client_name: "James A. Meguiso", contact: "09944061005", device: "Custom Gaming PC (Intel i5-12400F)", status: "Completed", issue: "Designed a secure SQL back-end and conducted comprehensive system health benchmarks.", cost: 0, created_at: "2026-05-21" },
      { tracking_number: "MJS-REP-8231", client_name: "Sarah Jimenez", contact: "09234598762", device: "Acer Nitro 5 Laptop", status: "In Progress", issue: "Motherboard keyboard controller failure, replacing keyboard assembly", cost: 3500, created_at: "2026-05-22" },
      { tracking_number: "MJS-REP-2954", client_name: "Aldrin De Guzman", contact: "09341235678", device: "Gigabyte RTX 3070", status: "Diagnosis", issue: "No display output. Suspected VRM power stage failure/short.", cost: 1800, created_at: "2026-05-23" },
      { tracking_number: "MJS-REP-7711", client_name: "Karen Go", contact: "09664531278", device: "HP Pavilion 15", status: "Pending", issue: "Bloated Battery replacement and hinge reinforcement", cost: 2800, created_at: "2026-05-23" }
    ];

    sampleRepairs.forEach(rep => {
      alasql("INSERT INTO repairs (tracking_number, client_name, contact, device, status, issue, cost, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [rep.tracking_number, rep.client_name, rep.contact, rep.device, rep.status, rep.issue, rep.cost, rep.created_at]);
    });

    console.log("SQL Database initialized successfully! Seeded", sampleProducts.length, "products,", sampleParts.length, "PC parts, and", sampleRepairs.length, "repairs.");
  } catch (err) {
    console.error("Failed to seed SQL Database of MJSTECH", err);
  }

  // -------------------------------------------------------------
  // API ENDPOINTS
  // -------------------------------------------------------------

  // Get Store catalog products
  app.get("/api/products", (req, res) => {
    try {
      const products = alasql("SELECT * FROM products ORDER BY id DESC");
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to load products: " + err.message });
    }
  });

  // Create a new product (Admin Only)
  app.post("/api/products", (req, res) => {
    const { name, category, price, specs, stock, image } = req.body;
    if (!name || !category || price === undefined || !specs) {
      return res.status(400).json({ error: "Missing required fields for product registration." });
    }
    try {
      alasql("INSERT INTO products (name, category, price, specs, stock, image) VALUES (?, ?, ?, ?, ?, ?)",
        [name, category, parseInt(price) || 0, specs, parseInt(stock) || 0, image || ""]
      );
      res.json({ success: true, message: "New product registered in database." });
    } catch (err: any) {
      res.status(500).json({ error: "Database error: " + err.message });
    }
  });

  // Update a product (Admin Only)
  app.put("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name, category, price, specs, stock, image } = req.body;
    if (!name || !category || price === undefined || !specs) {
      return res.status(400).json({ error: "Missing product payload attributes." });
    }
    try {
      alasql("UPDATE products SET name = ?, category = ?, price = ?, specs = ?, stock = ?, image = ? WHERE id = ?",
        [name, category, parseInt(price) || 0, specs, parseInt(stock) || 0, image || "", id]
      );
      res.json({ success: true, message: "Product updated successfully." });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update product: " + err.message });
    }
  });

  // Delete a product (Admin Only)
  app.delete("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    try {
      alasql("DELETE FROM products WHERE id = ?", [id]);
      res.json({ success: true, message: "Product deleted successfully from inventory catalog." });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to remove product: " + err.message });
    }
  });

  // Get PC builder components
  app.get("/api/pc-parts", (req, res) => {
    try {
      const parts = alasql("SELECT * FROM pc_parts");
      res.json(parts);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to load PC parts: " + err.message });
    }
  });

  // Fetch individual repair status via tracking code
  app.get("/api/repairs/:tracking_code", (req, res) => {
    const { tracking_code } = req.params;
    try {
      const repairs = alasql("SELECT * FROM repairs WHERE UPPER(tracking_number) = UPPER(?)", [tracking_code]) as any[];
      if (repairs && repairs.length > 0) {
        res.json(repairs[0]);
      } else {
        res.status(404).json({ error: `No active repair record found for: ${tracking_code}` });
      }
    } catch (err: any) {
      res.status(500).json({ error: "Database search failure: " + err.message });
    }
  });

  // Book a new repair service
  app.post("/api/repairs", (req, res) => {
    const { client_name, contact, device, issue } = req.body;

    if (!client_name || !contact || !device || !issue) {
      return res.status(400).json({ error: "All booking fields are required to secure an repair ticket." });
    }

    try {
      // Generate a tracking number: MJS-REP-[4-digit numerical tag]
      const randomTag = Math.floor(1000 + Math.random() * 9000);
      const tracking_number = `MJS-REP-${randomTag}`;
      const status = "Pending";
      const cost = 0; // Set initial diagnostic cost as pending/to-be-negotiated
      const created_at = new Date().toISOString().split('T')[0];

      alasql(
        "INSERT INTO repairs (tracking_number, client_name, contact, device, status, issue, cost, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [tracking_number, client_name, contact, device, status, issue, cost, created_at]
      );

      // Fetch newly created record
      const record = alasql("SELECT * FROM repairs WHERE tracking_number = ?", [tracking_number]);

      res.status(201).json({
        success: true,
        message: "Repair ticket registered under Talisay Cebu HQ database.",
        tracking_number,
        data: record[0]
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to write repair ticket to SQL database: " + err.message });
    }
  });

  // Get all repairs (Admin Only)
  app.get("/api/repairs", (req, res) => {
    try {
      const repairs = alasql("SELECT * FROM repairs ORDER BY id DESC");
      res.json(repairs);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to load repair logs: " + err.message });
    }
  });

  // Update a repair service ticket status & cost details (Admin Only)
  app.put("/api/repairs/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { client_name, contact, device, status, issue, cost } = req.body;
    
    if (!status || !client_name || !device) {
      return res.status(400).json({ error: "Missing required details to update the service ticket." });
    }

    try {
      alasql(
        "UPDATE repairs SET client_name = ?, contact = ?, device = ?, status = ?, issue = ?, cost = ? WHERE id = ?",
        [client_name, contact, device, status, issue || "", parseInt(cost) || 0, id]
      );
      res.json({ success: true, message: "Repair tracking file updated in Talisay SQL server index." });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to edit repair log: " + err.message });
    }
  });

  // Delete repair service ticket (Admin Only)
  app.delete("/api/repairs/:id", (req, res) => {
    const id = parseInt(req.params.id);
    try {
      alasql("DELETE FROM repairs WHERE id = ?", [id]);
      res.json({ success: true, message: "Repair ticket record cleared." });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to erase repair ticket: " + err.message });
    }
  });

  // Raw SQL statement Executor (Excellent for developer testing!)
  app.post("/api/raw-sql", (req, res) => {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "A valid SQL query block has to be furnished." });
    }

    try {
      const q = query.trim();
      const isSelect = q.toUpperCase().startsWith("SELECT") || q.toUpperCase().startsWith("SHOW") || q.toUpperCase().startsWith("EXPLAIN");

      // Execute SQL Statement directly through AlaSQL
      const result = alasql(q);

      if (isSelect) {
        if (Array.isArray(result) && result.length > 0) {
          const columns = Object.keys(result[0]);
          res.json({
            success: true,
            columns,
            rows: result
          });
        } else {
          res.json({
            success: true,
            columns: [],
            rows: []
          });
        }
      } else {
        // For Update, Insert, Delete, Create, Drop, etc.
        const affected = typeof result === "number" ? result : 1;
        res.json({
          success: true,
          columns: ["Operation Outcome", "Affected Rows"],
          rows: [{ "Operation Outcome": "Statement executed successfully.", "Affected Rows": affected }],
          affectedRows: affected
        });
      }
    } catch (err: any) {
      console.warn("Raw SQL Execution warning:", err.message);
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------
  // VITE DEV SERVER OR STATIC ASSETS ROUTING FOR PRODUCTION
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static outputs from /dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Listen to incoming commands on Port 3000 (0.0.0.0)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
