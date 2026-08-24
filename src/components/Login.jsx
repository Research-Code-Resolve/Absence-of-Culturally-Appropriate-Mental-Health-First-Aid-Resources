import React, { useState } from 'react';

export default function Login({ currentLangData, lang, setLang, onLoginSuccess }) {
  const [alias, setAlias] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (alias.trim()) {
      onLoginSuccess(alias.trim());
    }
  };

  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <h2>MHFA Connect</h2>
      <p>{currentLangData.privacy}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px', marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Enter anonymous alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          required
        />
        <button type="submit" className="download-btn" style={{ padding: '10px' }}>
          Continue Anonymously
        </button>
      </form>
    </div>
  );
}