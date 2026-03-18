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
  { id: "electronics", label: "Electronics", icon: "💻", color: "#4F8EF7", sub: ["Laptops", "Phones", "Accessories"] },
  { id: "fashion", label: "Fashion", icon: "👗", color: "#E879A0", sub: ["Tops", "Dresses", "Jeans"] },
  { id: "wearables", label: "Wearables", icon: "⌚", color: "#A855F7", sub: ["Smartwatches", "Fitness Trackers"] },
  { id: "photography", label: "Photography", icon: "📷", color: "#F59E0B", sub: ["Cameras", "Lenses", "Drones"] },
  { id: "audio", label: "Audio", icon: "🎧", color: "#10B981", sub: ["Headphones", "Speakers"] },
  { id: "sports", label: "Sports", icon: "🏋️", color: "#EF4444", sub: ["Fitness", "Outdoors"] },
  { id: "home-living", label: "Home & Living", icon: "🏠", color: "#6366F1", sub: ["Furniture", "Decor"] },
  { id: "books", label: "Books", icon: "📚", color: "#8B5CF6", sub: ["Fiction", "Non-Fiction"] },
  { id: "beauty", label: "Beauty", icon: "💎", color: "#EC4899", sub: ["Skincare", "Makeup"] },
  { id: "automotive", label: "Automotive", icon: "🚗", color: "#F97316", sub: ["Parts", "Tools"] },
  { id: "gaming", label: "Gaming", icon: "🎮", color: "#06B6D4", sub: ["Consoles", "Games"] },
  { id: "smart-home", label: "Smart Home", icon: "📺", color: "#84CC16", sub: ["Lighting", "Security"] },
];

const PRODUCTS = [
  { id: 1, name: "Wireless Earbuds Pro", category: "audio", price: 24500, orig: 29900, rating: 4.5, reviews: 128, badge: "Best Seller", color: "#10B981", emoji: "🎧", imgs: ["/images/product-earbuds.jpg"], colors: ["#000", "#fff"], specs: ["Bluetooth 5.2", "ANC"], sub: "Headphones" },
  { id: 2, name: "Smart Watch Elite", category: "wearables", price: 61000, orig: 75000, rating: 4.3, reviews: 87, badge: "New", color: "#A855F7", emoji: "⌚", imgs: ["/images/product-watch.jpg"], colors: ["#333", "#eee"], specs: ["GPS", "Heart Rate"], sub: "Smartwatches" },
  { id: 3, name: "Camera Lens 85mm", category: "photography", price: 137500, orig: 150000, rating: 4.7, reviews: 45, badge: "Premium", color: "#F59E0B", emoji: "📷", imgs: ["/images/product-lens.jpg"], colors: ["#000"], specs: ["F1.8 Aperture"], sub: "Lenses" },
  { id: 4, name: "Gaming Laptop X15", category: "electronics", price: 289000, orig: 320000, rating: 4.8, reviews: 213, badge: "Hot", color: "#EF4444", emoji: "💻", imgs: ["/images/product-laptop.jpg"], colors: ["#111", "#555"], specs: ["16GB RAM", "RTX 4070"], sub: "Laptops" },
  { id: 5, name: "Air Purifier Pro", category: "home-living", price: 45000, orig: 52000, rating: 4.4, reviews: 67, badge: "Eco", color: "#10B981", emoji: "🌬️", imgs: ["/images/product-purifier.jpg"], colors: ["#fff"], specs: ["HEPA Filter"], sub: "Decor" },
  { id: 6, name: "Running Shoes Max", category: "sports", price: 18500, orig: 22000, rating: 4.6, reviews: 302, badge: "Trending", color: "#F97316", emoji: "👟", imgs: ["/images/product-shoes.jpg"], colors: ["#f00", "#00f", "#0f0"], specs: ["Lightweight", "Breathable"], sub: "Fitness" },
  { id: 7, name: "4K OLED Smart TV", category: "smart-home", price: 185000, orig: 210000, rating: 4.9, reviews: 156, badge: "Editor's Pick", color: "#06B6D4", emoji: "📺", imgs: ["/images/product-tv.jpg"], colors: ["#222"], specs: ["65-inch", "Dolby Vision"], sub: "Lighting" },
  { id: 8, name: "Mechanical Keyboard", category: "electronics", price: 22000, orig: 25000, rating: 4.5, reviews: 89, badge: "Popular", color: "#6366F1", emoji: "⌨️", imgs: ["/images/product-keyboard.jpg"], colors: ["#fff", "#000"], specs: ["RGB Backlight", "Blue Switches"], sub: "Accessories" },
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