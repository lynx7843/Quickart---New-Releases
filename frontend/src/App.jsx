import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import QuickArt from './QuickArt.jsx';
import FirstNavbar from "./assets/firstnavbar";
import SecondNavbar from "./assets/Secondnavbar";
import Footer from './assets/Footer.jsx';
import QuickArtAI from './QuickArtAI.jsx';
import QuickArt3D from './quickart3d.jsx';
import VirtualFittingRoom from './VirtualFittingRoom.jsx';
import AllCategory from './assets/all.jsx';
import Home from './assets/home.jsx';
import AuthBuilderUI from './AuthBuilderUI.jsx';
import WebsiteBuilder from './WebsiteBuilder.jsx';
import LoginPage from './assets/login.jsx';
import RegisterPage from './assets/RegisterPage.jsx';
import AdminPanel from './AdminPanel.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import AdminProducts from './AdminProducts.jsx';
import AdminCategories from './AdminCategories.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { CartProvider } from './pages/CartContext.jsx';
import CartPage from './assets/addtocart.jsx';
import AboutUsPage from './assets/AboutUs.jsx';
import OffersPage from './assets/OffersPage.jsx';
import FreqSearchPage from './assets/FreqSearchPage.jsx';
import TopSellingPage from './assets/TopSellingPage.jsx';
import ContactUsPage from './assets/ContactUsPage.jsx';
import HelpCenterPage from './assets/HelpCenterPage.jsx';
import NewArrivalsPage from './assets/NewArrivalsPage.jsx';
import BrandStorePage from './assets/BrandStorePage.jsx';
import InfoPage from './assets/InfoPage.jsx';

const CATEGORIES = [
  { id: "fashion", label: "Fashion", icon: "👕", color: "#557a8c", sub: ["Men's Shirts", "Women's Dresses"] },
  { id: "electronics", label: "Electronics", icon: "📱", color: "#557a8c", sub: ["Mobile Phones", "Laptops"] },
  { id: "home-living", label: "Home & Living", icon: "🏠", color: "#557a8c", sub: ["Sofas", "Beds"] },
  { id: "beauty-personal", label: "Beauty", icon: "🧴", color: "#557a8c", sub: ["Skincare", "Makeup"] },
  { id: "sports-fitness", label: "Sports", icon: "⚽", color: "#557a8c", sub: ["Gym Equipment", "Sportswear"] },
  { id: "gaming", label: "Gaming", icon: "🎮", color: "#557a8c", sub: ["Consoles", "Games"] },
  { id: "books-education", label: "Books", icon: "📚", color: "#557a8c", sub: ["Novels", "Stationery"] },
  { id: "automotive", label: "Automotive", icon: "🚗", color: "#557a8c", sub: ["Car Accessories", "Engine Oil"] },
  { id: "groceries", label: "Groceries", icon: "🥗", color: "#557a8c", sub: ["Fruits & Vegetables", "Snacks"] },
  { id: "pets", label: "Pets", icon: "🐶", color: "#557a8c", sub: ["Pet Food", "Pet Toys"] },
  { id: "travel-lifestyle", label: "Travel", icon: "🧳", color: "#557a8c", sub: ["Bags & Luggage", "Sunglasses"] },
  { id: "health-medical", label: "Health", icon: "🏥", color: "#557a8c", sub: ["Supplements", "First Aid"] },
];

const PRODUCTS = [
  { id: 1, name: "Men's Casual Shirt", category: "fashion", price: 4500, orig: 5500, rating: 4.6, reviews: 150, badge: "New", color: "#557a8c", emoji: "👕", imgs: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80"], specs: ["Cotton", "Slim Fit"], sub: "Men's Casual Shirts" },
  { id: 2, name: "Latest Smartphone Pro", category: "electronics", price: 215000, orig: 240000, rating: 4.9, reviews: 540, badge: "Hot", color: "#557a8c", emoji: "📱", imgs: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80"], specs: ["256GB", "OLED Display"], sub: "Mobile Phones" },
  { id: 3, name: "Modern Velvet Sofa", category: "home-living", price: 125000, orig: 150000, rating: 4.7, reviews: 95, badge: "Top Rated", color: "#557a8c", emoji: "🛋️", imgs: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80"], specs: ["3-Seater", "Green Velvet"], sub: "Sofas" },
  { id: 4, name: "Organic Face Cream", category: "beauty-personal", price: 3500, orig: 4000, rating: 4.9, reviews: 320, badge: "Organic", color: "#557a8c", emoji: "🧴", imgs: ["https://images.unsplash.com/photo-1556228552-6c3638d6e388?auto=format&fit=crop&w=300&q=80"], specs: ["50ml", "Anti-aging"], sub: "Face Wash & Creams" },
  { id: 5, name: "Professional Dumbbell Set", category: "sports-fitness", price: 25000, orig: 30000, rating: 4.7, reviews: 112, badge: "Pro Choice", color: "#557a8c", emoji: "🏋️", imgs: ["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=300&q=80"], specs: ["20kg Set", "Adjustable"], sub: "Gym Equipment" },
  { id: 6, name: "Next-Gen Gaming Console", category: "gaming", price: 150000, orig: 165000, rating: 4.9, reviews: 850, badge: "Best Seller", color: "#557a8c", emoji: "🎮", imgs: ["https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=300&q=80"], specs: ["8K Output", "1TB SSD"], sub: "Consoles" },
  { id: 7, name: "The Great Gatsby Novel", category: "books-education", price: 1200, orig: 1500, rating: 4.8, reviews: 1205, badge: "Classic", color: "#557a8c", emoji: "📚", imgs: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80"], specs: ["Hardcover", "F. Scott Fitzgerald"], sub: "Novels" },
  { id: 8, name: "Leather Car Seat Covers", category: "automotive", price: 18000, orig: 22000, rating: 4.5, reviews: 88, badge: "Premium", color: "#557a8c", emoji: "🚗", imgs: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=300&q=80"], specs: ["Universal Fit", "PU Leather"], sub: "Car Accessories" },
  { id: 9, name: "Fresh Organic Vegetables", category: "groceries", price: 1500, orig: 1800, rating: 4.9, reviews: 450, badge: "Fresh", color: "#557a8c", emoji: "🥗", imgs: ["https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80"], specs: ["1kg Box", "Farm Fresh"], sub: "Fruits & Vegetables" },
  { id: 10, name: "Premium Dog Food", category: "pets", price: 8500, orig: 9000, rating: 4.8, reviews: 215, badge: "Vet Approved", color: "#557a8c", emoji: "🐶", imgs: ["https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=300&q=80"], specs: ["10kg Bag", "For Adult Dogs"], sub: "Pet Food" },
  { id: 11, name: "Leather Travel Duffle Bag", category: "travel-lifestyle", price: 22000, orig: 25000, rating: 4.7, reviews: 130, badge: "Handmade", color: "#557a8c", emoji: "🧳", imgs: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80"], specs: ["Genuine Leather", "Cabin Size"], sub: "Bags & Luggage" },
  { id: 12, name: "Vitamin C Supplements", category: "health-medical", price: 2500, orig: 3000, rating: 4.9, reviews: 650, badge: "Essential", color: "#557a8c", emoji: "💊", imgs: ["https://images.unsplash.com/photo-1511688878353-3a2f5be94c54?auto=format&fit=crop&w=300&q=80"], specs: ["1000mg", "90 Tablets"], sub: "Supplements" },
];

const MainLayout = () => (
  <>
    <FirstNavbar />
    <SecondNavbar />
    <Outlet />
    <Footer />
  </>
);

const AuthLayout = () => (
  <>
    <Outlet />
    <Footer />
  </>
);

function App() {
  const [products, setProducts] = useState(PRODUCTS);
  const [cats, setCats] = useState(CATEGORIES);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/auth-builder-ui" element={<AuthBuilderUI />} />
            </Route>

            <Route path="/admin" element={<AdminPanel />}>
              <Route index element={<Navigate to="products" replace />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>

            <Route element={<MainLayout />}>
              <Route path="/" element={<QuickArt products={products} setProducts={setProducts} cats={cats} setCats={setCats} />} />
              <Route path="/quickart" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/quick-art-ai" element={<QuickArtAI />} />
              <Route path="/quickart3d" element={<QuickArt3D />} />
              <Route path="/virtual-fitting-room" element={<VirtualFittingRoom />} />
              <Route path="/all-categories" element={<AllCategory categories={cats} products={products} />} />
              <Route path="/website-builder" element={<WebsiteBuilder />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/frequent-search" element={<FreqSearchPage />} />
              <Route path="/top-selling" element={<TopSellingPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/help-center" element={<HelpCenterPage />} />
              
              {/* Footer Pages */}
              <Route path="/new-arrivals" element={<NewArrivalsPage />} />
              <Route path="/brand-store" element={<BrandStorePage />} />
              <Route path="/flash-deals" element={<OffersPage />} /> {/* Reuse Offers */}
              <Route path="/page/:pageSlug" element={<InfoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;