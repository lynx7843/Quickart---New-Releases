import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Upload, Camera, ExternalLink } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
  
  .cg-container {
    min-height: 100vh;
    background-color: #F8F9FA;
    font-family: 'DM Sans', sans-serif;
    color: #1a1a1a;
  }
  
  .cg-header {
    background: #fff;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  }
  
  .cg-back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    background: none;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.95rem;
    transition: color 0.2s;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
  }
  .cg-back-btn:hover { color: #1a1a1a; background: #f1f5f9; }

  .cg-main {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .cg-hero {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
  }
  
  .cg-title {
    font-size: 2.75rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #1a1a1a 0%, #557a8c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.03em;
  }
  
  .cg-subtitle {
    color: #64748b;
    font-size: 1.125rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* Action Cards */
  .cg-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3.5rem;
  }

  .cg-card {
    background: #fff;
    border-radius: 1.5rem;
    padding: 2rem;
    border: 1px solid #e2e8f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .cg-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom right, rgba(85, 122, 140, 0.05), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .cg-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px -12px rgba(85, 122, 140, 0.15);
    border-color: #557a8c;
  }
  .cg-card:hover::after { opacity: 1; }

  .cg-icon-box {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
    font-size: 1.75rem;
    background: #F4F6FA;
    color: #557a8c;
    transition: transform 0.3s;
  }
  .cg-card:hover .cg-icon-box { transform: scale(1.1) rotate(-5deg); }

  .cg-card-title {
    font-weight: 700;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: #1e293b;
  }
  
  .cg-card-desc {
    color: #94a3b8;
    font-size: 0.9rem;
  }

  /* Gallery Grid */
  .cg-gallery-section {
    background: #fff;
    border-radius: 2rem;
    padding: 2.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01);
  }

  .cg-section-header {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .cg-search-bar {
    display: flex;
    gap: 1rem;
    background: #F8F9FA;
    padding: 0.875rem 1.5rem;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    align-items: center;
    width: 100%;
    max-width: 500px;
    transition: border-color 0.2s;
  }
  .cg-search-bar:focus-within { border-color: #557a8c; background: #fff; }
  
  .cg-search-input {
    flex: 1;
    background: none;
    border: none;
    font-size: 1rem;
    outline: none;
    color: #1a1a1a;
  }

  .cg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  .cg-item {
    aspect-ratio: 3/4;
    border-radius: 1.25rem;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    transition: transform 0.2s;
  }
  
  .cg-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .cg-item:hover img {
    transform: scale(1.08);
  }

  .cg-item-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%);
    opacity: 0;
    transition: opacity 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.25rem;
  }
  
  .cg-item:hover .cg-item-overlay {
    opacity: 1;
  }

  .cg-item-btn {
    background: #fff;
    color: #1a1a1a;
    border: none;
    padding: 0.875rem;
    border-radius: 0.875rem;
    font-weight: 700;
    width: 100%;
    cursor: pointer;
    transform: translateY(20px);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .cg-item:hover .cg-item-btn {
    transform: translateY(0);
  }

  .cg-item-tag {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(4px);
    padding: 0.35rem 0.75rem;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: #1a1a1a;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s;
  }
  .cg-item:hover .cg-item-tag { opacity: 1; transform: translateY(0); }
`;

// Generating 100 mock images using reliable Unsplash sources for clothing
const IMAGE_SOURCES = [
  '1515886657613-9f3515b0c78f', // Fashion generic
  '1556905055-8f358a7a47b2',     // Clothes rail
  '1595777457583-95e059d581b8', // Dress
  '1434389677669-e08b4cac3105', // Cloth texture
  '1591047139829-d91a961276db', // T-shirt
  '1564859223-a28038b6400d',     // Shirt
  '1618354691373-d851c5c3a990', // Shirt closeup
  '1585487000160-6ebcfceb0d03', // Coat
  '1576566588028-4147f3842f27', // Hoodie
  '1532453288672-3a27e9be9efd'  // Accessories/Clothes
];

const MOCK_IMAGES = Array.from({ length: 100 }).map((_, i) => ({
  id: i,
  // Cycle through image sources to ensure validity
  url: `https://images.unsplash.com/photo-${IMAGE_SOURCES[i % IMAGE_SOURCES.length]}?w=600&q=80&auto=format&fit=crop`,
  name: `Trend Item #${i + 1}`,
  category: ['Summer', 'Casual', 'Formal', 'Streetwear'][i % 4]
}));

export default function ClothGallery() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Pass the uploaded image data back to the Virtual Fitting Room
        navigate('/virtual-fitting-room', { state: { clothImage: event.target.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectCloth = (url) => {
    navigate('/virtual-fitting-room', { state: { clothImage: url } });
  };

  const handleGoogleConnect = () => {
    const query = prompt("Enter product name to search on Google Shopping:", "Red floral dress");
    if (query) {
        // Simulating a connection/search
        alert(`Connecting to Google Shopping API for "${query}"...\n(Mock Integration: In a real app, this would fetch product images)`);
        // For demo, just filter our gallery based on random logic or show all
        setSearchTerm(query.split(' ')[0]); 
    }
  };

  const filteredImages = MOCK_IMAGES.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    img.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cg-container">
      <style>{styles}</style>
      
      <header className="cg-header">
        <button onClick={() => navigate('/virtual-fitting-room')} className="cg-back-btn">
          <ArrowLeft size={18} /> Back to Fitting Room
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: '#557a8c', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>Q</div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' }}>QuickArt Gallery</span>
        </div>
      </header>

      <main className="cg-main">
        <div className="cg-hero">
          <h1 className="cg-title">Virtual Wardrobe</h1>
          <p className="cg-subtitle">Select a piece to try on instantly. Upload your own, browse our curated collection, or connect with Google Shopping.</p>
        </div>

        <div className="cg-actions">
          {/* Upload Card */}
          <label className="cg-card">
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
            <div className="cg-icon-box">
              <Upload size={32} strokeWidth={1.5} />
            </div>
            <div className="cg-card-title">Upload from Device</div>
            <div className="cg-card-desc">Use your own clothing image (JPG, PNG)</div>
          </label>

          {/* Google Connect Card */}
          <div className="cg-card" onClick={handleGoogleConnect}>
            <div className="cg-icon-box" style={{ background: '#E8F0FE', color: '#4285F4' }}>
              <ExternalLink size={32} strokeWidth={1.5} />
            </div>
            <div className="cg-card-title">Connect Google</div>
            <div className="cg-card-desc">Search products via Google Shopping</div>
          </div>

          {/* Camera Card */}
          <div className="cg-card" onClick={() => navigate('/virtual-fitting-room')}>
             <div className="cg-icon-box" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <Camera size={32} strokeWidth={1.5} />
            </div>
            <div className="cg-card-title">Capture Live</div>
            <div className="cg-card-desc">Take a photo of a cloth item</div>
          </div>
        </div>

        <section className="cg-gallery-section">
          <div className="cg-section-header">
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Trending Now</h2>
                <p style={{ color: '#64748b' }}>Over 100+ new arrivals ready for virtual try-on.</p>
            </div>
            <div className="cg-search-bar">
                <Search size={20} color="#94a3b8" />
                <input 
                type="text" 
                placeholder="Search style, color, or collection..." 
                className="cg-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>

          <div className="cg-grid">
            {filteredImages.map((img) => (
              <div key={img.id} className="cg-item" onClick={() => handleSelectCloth(img.url)}>
                <div className="cg-item-tag">{img.category}</div>
                <img src={img.url} alt={img.name} loading="lazy" />
                <div className="cg-item-overlay">
                  <button className="cg-item-btn">Try On Now</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}