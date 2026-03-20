import React from 'react';
import { Cpu, View, Zap } from 'lucide-react';

const teamMembers = [
  { name: 'KDS Maduranga', id: '10965448', role: 'Team Leader', avatar: 'KM' },
  { name: 'Mahanama Sewwandi', id: '10965558', role: 'Member', avatar: 'MS' },
  { name: 'Udupiti Deshan', id: '10965350', role: 'Member', avatar: 'UD' },
  { name: 'Keelle Rupasena', id: '10965534', role: 'Member', avatar: 'KR' },
  { name: 'Wijesinghe Wijesinghe', id: '10965279', role: 'Member', avatar: 'WW' },
  { name: 'Sayuni Senanayake', id: '10965551', role: 'Member', avatar: 'SS' },
  { name: 'Palamandadige Peiris', id: '10965498', role: 'Member', avatar: 'PP' },
  { name: 'Loku Lokuwithana', id: '10965432', role: 'Member', avatar: 'LL' },
];

const AboutUsPage = () => {
  return (
    <div style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif", background: "#F4F6FA", minHeight: "calc(100vh - 120px)", padding: "40px 20px" }}>
      <style>{`
        .team-card {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0,0,0,0.07);
          transition: all 0.3s ease;
          border: 1px solid #F0F0F0;
        }
        .team-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
          border-color: #557a8c;
        }
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #557a8c;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 700;
          margin: 0 auto 16px;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(2, 79, 89, 0.3);
        }
      `}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 60 }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#111111", marginBottom: 12, letterSpacing: "-0.02em" }}>
            The <span style={{ color: "#557a8c" }}>QuickArt</span> Team
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#557a8c", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            We are a passionate group of innovators, developers, and designers dedicated to revolutionizing the e-commerce experience with cutting-edge AI and 3D technologies.
          </p>
        </header>

        <section style={{ marginBottom: 60 }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, color: '#557a8c', marginBottom: 40 }}>
            What Makes Us Different?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ display: 'inline-flex', padding: '18px', background: '#fff', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.07)' }}>
                <Cpu size={32} color="#557a8c" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#557a8c', marginBottom: 8 }}>AI-Powered Shopping</h3>
              <p style={{ fontSize: 14, color: '#557a8c', lineHeight: 1.6 }}>
                Our smart AI assistant helps you find the perfect product in seconds. Just describe what you want, and let our technology do the rest.
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ display: 'inline-flex', padding: '18px', background: '#fff', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.07)' }}>
                <View size={32} color="#557a8c" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#557a8c', marginBottom: 8 }}>Immersive 3D & AR</h3>
              <p style={{ fontSize: 14, color: '#557a8c', lineHeight: 1.6 }}>
                Visualize products in your own space with our augmented reality try-on and interactive 3D viewers. Shop with confidence, no surprises.
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ display: 'inline-flex', padding: '18px', background: '#fff', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.07)' }}>
                <Zap size={32} color="#557a8c" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#557a8c', marginBottom: 8 }}>Fast & Reliable</h3>
              <p style={{ fontSize: 14, color: '#557a8c', lineHeight: 1.6 }}>
                Experience a seamless and speedy shopping journey from browsing to checkout, backed by a reliable platform you can trust.
              </p>
            </div>
          </div>
        </section>

        <div>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, color: '#557a8c', marginBottom: 40 }}>Meet the Innovators</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 32 }}>
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="avatar">{member.avatar}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111111", margin: "0 0 4px" }}>{member.name}</h3>
                <p style={{ fontSize: 14, color: "#557a8c", fontWeight: 600, margin: 0 }}>{member.role}</p>
                <p style={{ fontSize: 12, color: "#557a8c", marginTop: 8, background: "#F4F6FA", padding: "4px 8px", borderRadius: 6, display: "inline-block" }}>
                  ID: {member.id}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;