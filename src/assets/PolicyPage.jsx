import React from 'react';

const PolicyPage = ({ title, content }) => {
  return (
    <div style={{ padding: "60px 20px", background: "#fff", minHeight: "100vh", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid #eee" }}>{title}</h1>
        <div style={{ lineHeight: "1.8", color: "#444", fontSize: "16px" }}>
          {content || (
            <>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p style={{ marginTop: "20px" }}>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p style={{ marginTop: "20px" }}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;