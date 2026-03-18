import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const pageData = {
  returns: {
    title: "Returns Policy",
    content: <p>We accept returns within 30 days of purchase. Items must be unused and in original packaging.</p>
  },
  shipping: {
    title: "Shipping Information",
    content: <p>Standard shipping takes 3-5 business days. Express shipping available at checkout.</p>
  },
  payment: {
    title: "Payment Methods",
    content: <p>We accept Visa, Mastercard, PayPal, and Cash on Delivery.</p>
  },
  careers: {
    title: "Careers",
    content: <p>Join our team! Check back later for open positions.</p>
  },
  privacy: {
    title: "Privacy Policy",
    content: <p>Your privacy is important to us. We do not sell your data.</p>
  },
  terms: {
    title: "Terms & Conditions",
    content: <p>Please read our terms carefully before using our services.</p>
  },
  cookies: {
    title: "Cookie Policy",
    content: <p>We use cookies to improve your experience.</p>
  },
  press: {
    title: "Press",
    content: <p>Latest news and press releases from QuickArt.</p>
  },
  blog: {
    title: "Blog",
    content: <p>Read our latest stories and updates.</p>
  },
  affiliates: {
    title: "Affiliate Program",
    content: <p>Join our affiliate program and earn commissions.</p>
  },
  'image-search': {
    title: "Image Search",
    content: <p>Upload an image to search for products (Feature coming soon).</p>
  }
};

const InfoPage = () => {
  const { pageSlug } = useParams();
  const page = pageData[pageSlug];

  if (!page) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ padding: "60px 20px", background: "#fff", minHeight: "100vh", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid #eee" }}>{page.title}</h1>
        <div style={{ lineHeight: "1.8", color: "#444", fontSize: "16px" }}>
          {page.content}
        </div>
      </div>
    </div>
  );
};

export default InfoPage;