# 🛍️ DukaanOnline – Digital Kirana Store (PWA)

A modern, mobile-first, production-grade Progressive Web App (PWA) designed for neighborhood Kirana stores and local grocery businesses in India. Featuring bank-grade Supabase cloud security, realtime catalog syncing, official authentication, and 1-click WhatsApp order slip generation.

---

## ✨ Key Features

### 📲 Progressive Web App (PWA - No Play Store Needed)
* **Direct Install**: Customers and shopkeepers can install the app directly to their Android, iOS, or Desktop home screens with a single tap.
* **Standalone Experience**: Runs full-screen without browser address bars, just like a native mobile app.
* **Offline Caching**: Built-in Service Worker (`sw.js`) pre-caches core assets, enabling fast loads and offline catalog browsing with automatic network recovery banners.

### 🛡️ Bank-Grade Database Security (PostgreSQL RLS)
* **Zero Client-Side Vulnerability**: All database operations are guarded by Supabase **Row Level Security (RLS)** at the server level.
* **Tamper-Proof**: Modifying prices, deleting items, or hacking catalog data from browser DevTools/Console is strictly blocked (`403 Forbidden`).
* **Customer Privacy**: Public visitors can only submit (`INSERT`) their own orders. Past customer records, order histories, phone numbers, and addresses remain private and accessible only to the authenticated shopkeeper.

### 🔐 Secure Shopkeeper Management Portal
* **Official Supabase Auth**: JWT-encrypted email and password authentication (`supabase.auth`).
* **Brute-Force Protection**: Automatic rate-limiting lockout (3-minute lock after 4 failed attempts) and 60-minute session inactivity auto-logout.
* **Full Store Control**: Live catalog management, pack size variants (250g, 500g, 1kg, 5kg), custom discount deals, delivery radius, and store working hours.

### 🧾 Monospace WhatsApp Order Receipts
* **POS Thermal Slip Format**: Customer orders are automatically formatted into an authentic 32-character fixed-width supermarket receipt slip with itemized quantities, subtotal, delivery fee, and customer address.
* **Direct WhatsApp Integration**: 1-click dispatch opens WhatsApp with the formatted order ready to send to the store's phone number.

### ⚡ Realtime Cloud Synchronization
* **Live Catalog Sync**: When the shopkeeper updates a price or marks an item out of stock, changes reflect in realtime across all connected customer screens without manual refresh.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 (Functional components, Hooks, Context API) |
| **Build Tool** | Vite 6 (Lightning-fast HMR and minification) |
| **Styling** | Tailwind CSS (Mobile-first responsive design, custom palettes) |
| **Icons** | Lucide React |
| **Backend & Database** | Supabase Cloud (PostgreSQL 15) |
| **Authentication** | Supabase Auth (JWT token-based security) |
| **Offline & PWA** | Web App Manifest (`manifest.webmanifest`), Service Worker API |

---

## 📁 Project Directory Structure

```text
dukaan-online/
├── public/
│   ├── favicon.svg             # Store browser tab icon
│   ├── manifest.webmanifest    # Native PWA install manifest
│   ├── sw.js                   # Service worker for offline caching
│   └── icons/                  # High-res PWA app icons (192x192, 512x512)
├── src/
│   ├── components/
│   │   ├── cart/               # CartDrawer, CartItem, CartSummary, FloatingCartBar
│   │   ├── common/             # Button, SectionHeading, WhatsAppButton, PwaInstallPrompt
│   │   ├── home/               # Hero, CategorySection, ProductSection, OfferBanner, StoreBenefits
│   │   ├── layout/             # Navbar, Footer, MobileBottomNav
│   │   └── products/           # ProductCard, ProductGrid, ProductSearch, CategoryFilter
│   ├── context/
│   │   ├── CartContext.jsx     # Cart state management (items, totals, badge counters)
│   │   └── StoreContext.jsx    # Supabase cloud state, auth sessions, live listeners
│   ├── data/
│   │   ├── categories.js       # Core grocery categories
│   │   ├── products.js         # Initial grocery catalog & variants
│   │   └── storeConfig.js      # Dynamic store identity & delivery policy
│   ├── hooks/
│   │   ├── useCart.js          # Cart consumer hook
│   │   └── useStore.js         # Store & auth consumer hook
│   ├── pages/
│   │   ├── Home.jsx            # Storefront homepage
│   │   ├── Products.jsx        # Searchable, filterable catalog
│   │   ├── Cart.jsx            # Checkout & delivery address page
│   │   ├── About.jsx           # Store story & trust guarantees
│   │   ├── Contact.jsx         # Contact cards, maps & WhatsApp chat
│   │   └── Admin.jsx           # Authenticated shopkeeper management portal
│   ├── services/
│   │   └── supabaseClient.js   # Supabase client singleton
│   ├── utils/
│   │   ├── formatPrice.js      # INR currency formatting (₹)
│   │   └── whatsappOrder.js    # Monospace POS receipt generator
│   ├── App.jsx                 # Main layout & ErrorBoundary wrapper
│   └── main.jsx                # App entrypoint & ServiceWorker registration
├── supabase_secure_rls.sql     # Production PostgreSQL Row Level Security script
├── .env.example                # Clean environment template (safe for git)
├── .gitignore                  # Git ignore rules guarding secrets
├── index.html                  # HTML5 template with SEO schema & PWA tags
├── tailwind.config.js          # Tailwind CSS theme configuration
└── vite.config.js              # Vite bundler configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js** v18+ installed on your machine.
* A free **[Supabase](https://supabase.com)** account.

### 2. Clone and Install
```bash
git clone https://github.com/<YOUR_USERNAME>/dukaan-online.git
cd dukaan-online
npm install
```

### 3. Configure Environment Variables
Copy the template file to create your active `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your Supabase project keys and store details:
```env
# Supabase Cloud Database & Authentication
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-key

# Store Identity
VITE_STORE_NAME="Apna Kirana Store"
VITE_STORE_OWNER="Store Owner"

# Contact & WhatsApp Ordering (without '+' or spaces, e.g. 919876543210)
VITE_STORE_WHATSAPP=919876543210
VITE_STORE_PHONE="+91 98765 43210
VITE_STORE_EMAIL=store@example.com

# Store Location
VITE_STORE_AREA="Central Market"
VITE_STORE_CITY="New Delhi"
```

### 4. Setup Database & Row Level Security (RLS)
1. Open your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Navigate to **SQL Editor** -> **New query**.
3. Copy and paste the entire contents of [`supabase_secure_rls.sql`](./supabase_secure_rls.sql).
4. Click **Run** (Ctrl + Enter).
5. In Supabase Dashboard -> **Authentication** -> **Providers** -> **Email**:
   * Turn **OFF** *"Confirm email"* (Allows instant login without broken verification links).

### 5. Run the Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🔒 Security Architecture (Row Level Security)

| Database Table | Public User (`anon`) | Authenticated Shopkeeper (`authenticated`) |
|---|---|---|
| `categories` | Read Only (`SELECT`) | Full Access (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) |
| `products` | Read Only (`SELECT`) | Full Access (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) |
| `store_settings` | Read Only (`SELECT`) | Full Access (`SELECT`, `UPDATE`) |
| `orders` | Submit Only (`INSERT`) | Full Access (`SELECT`, `UPDATE`) |

*All writes from non-authenticated users are blocked directly at the PostgreSQL database level.*

---

## 📦 Production Build & Deployment

To create an optimized production build:
```bash
npm run build
```
The output will be placed in the `dist/` directory.

### Deploying to Cloud Hosts:
* **Vercel**: Import the GitHub repository, set environment variables matching `.env`, and click **Deploy**.
* **Netlify**: Set build command to `npm run build` and publish directory to `dist/`.
* **Cloudflare Pages**: Connect your Git repository, set framework preset to `Vite`, and deploy.

---

## 📄 License
This project is open-source and available under the **MIT License**.
