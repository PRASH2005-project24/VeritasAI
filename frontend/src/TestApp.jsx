import React from 'react';

function TestApp() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '40px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>VeritasAI</h1>
        <p style={{ fontSize: '24px', marginBottom: '30px' }}>🚀 Frontend is Working!</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginTop: '30px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h3>✅ React</h3>
            <p>Running</p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h3>✅ CSS</h3>
            <p>Working</p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h3>✅ Vite</h3>
            <p>No Errors</p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h3>⚡ Ready</h3>
            <p>For Backend</p>
          </div>
        </div>
        <p style={{ marginTop: '30px', fontSize: '16px', opacity: 0.8 }}>
          Port: 5173 | Ready for API Integration
        </p>
      </div>
    </div>
  );
}

export default TestApp;