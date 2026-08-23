import React, { useState, useEffect } from 'react';
import { LANGS, SELF_HELP_MODULES, PEER_COUNSELLORS, SUPPORT_DIRECTORY } from './constants';
import { sanitizeText } from './security';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';

const COUNTRY_CONFIG = {
  LS: { name: '🇱🇸 Lesotho', defaultLang: 'SH' },
  KE: { name: '🇰🇪 Kenya', defaultLang: 'SW' },
  ZA: { name: '🇿🇦 South Africa', defaultLang: 'ZU' }
};

const LANGUAGE_LABELS = {
  EN: '🇬🇧 English',
  SH: '🇱🇸 Sesotho',
  SW: '🇰🇪 Kiswahili',
  ZU: '🇿🇦 isiZulu',
  XH: '🇿🇦 isiXhosa',
  AF: '🇿🇦 Afrikaans'
};

const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'chat', label: 'Chat', icon: '💬' },
  { key: 'peer', label: 'Peers', icon: '👥' },
  { key: 'selfhelp', label: 'Help', icon: '📚' },
  { key: 'resources', label: 'Directory', icon: '🗺️' },
  { key: 'settings', label: 'Settings', icon: '⚙️' }
];

export default function App() {
  const [country, setCountry] = useState('LS');
  const [lang, setLang] = useState('EN');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('mhfa_auth') === 'true';
  });
  const [userAlias, setUserAlias] = useState(() => {
    return sessionStorage.getItem('mhfa_alias') || '';
  });

  const [screen, setScreen] = useState('home');
  const [pinModal, setPinModal] = useState(false);
  const [pinEntry, setPinEntry] = useState('');
  const [activePeer, setActivePeer] = useState(null);

  const currentLangData = LANGS[lang] || LANGS['EN'];

  const [messages, setMessages] = useState([
    { role: 'bot', text: currentLangData.greeting, time: 'Now · anonymous' }
  ]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    const defaultLanguage = COUNTRY_CONFIG[selectedCountry]?.defaultLang || 'EN';
    setLang(defaultLanguage);
  };

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [{ role: 'bot', text: currentLangData.greeting, time: 'Now · anonymous' }];
      }
      return prev;
    });
  }, [lang]);

  const handleLoginSuccess = (alias) => {
    setUserAlias(alias);
    setIsAuthenticated(true);
    sessionStorage.setItem('mhfa_auth', 'true');
    sessionStorage.setItem('mhfa_alias', alias);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserAlias('');
    sessionStorage.removeItem('mhfa_auth');
    sessionStorage.removeItem('mhfa_alias');
    setMessages([{ role: 'bot', text: currentLangData.greeting, time: 'Now · anonymous' }]);
    setScreen('home');
    setActivePeer(null);
  };

  const downloadModule = (mod) => {
    const safeContent = sanitizeText(mod.content);
    const blob = new Blob([safeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mod.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <Login
        currentLangData={currentLangData}
        lang={lang}
        setLang={setLang}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="app">
      <header className="top-bar">
        <button
          type="button"
          className="logo-btn"
          onClick={() => setScreen('home')}
          aria-label="Go to homepage"
        >
          <div className="logo">MHFA<span>Connect</span></div>
        </button>

        {/* Country Selector Dropdown */}
        <div className="top-select-wrapper">
          <select
            value={country}
            onChange={handleCountryChange}
            className="top-dropdown"
          >
            <option value="LS">🇱🇸 Lesotho</option>
            <option value="KE">🇰🇪 Kenya</option>
            <option value="ZA">🇿🇦 S. Africa</option>
          </select>
        </div>

        {/* Multi-Language Dropdown Selector */}
        <div className="top-select-wrapper">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="top-dropdown"
          >
            {Object.keys(LANGS).map((code) => (
              <option key={code} value={code}>
                {LANGUAGE_LABELS[code] || code}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="user-badge"
          onClick={handleLogout}
          title="Click to logout"
          aria-label="Logout user"
        >
          👤 {userAlias} <span className="logout-icon">🚪</span>
        </button>
      </header>

      {screen === 'home' && (
        <main className="screen">
          <div className="hero-band">
            <div className="privacy-banner">
              <span>🔒</span>
              <span>{currentLangData.privacy}</span>
            </div>
            <h1>{currentLangData.h1}</h1>
            <p>{currentLangData.p}</p>
          </div>

          <nav className="quick-actions" aria-label="Quick Navigation">
            <button type="button" className="qa-card" onClick={() => { setActivePeer(null); setScreen('chat'); }}>
              <div className="qa-icon" aria-hidden="true">💬</div>
              <div className="qa-label">{currentLangData.qa1}</div>
              <div className="qa-sub">{currentLangData.qa1s}</div>
            </button>
            <button type="button" className="qa-card" onClick={() => setScreen('selfhelp')}>
              <div className="qa-icon" aria-hidden="true">📚</div>
              <div className="qa-label">{currentLangData.qa2}</div>
              <div className="qa-sub">{currentLangData.qa2s}</div>
            </button>
            <button type="button" className="qa-card" onClick={() => setScreen('peer')}>
              <div className="qa-icon" aria-hidden="true">👥</div>
              <div className="qa-label">{currentLangData.qa4}</div>
              <div className="qa-sub">{currentLangData.qa4s}</div>
            </button>
            <button type="button" className="qa-card" onClick={() => setScreen('resources')}>
              <div className="qa-icon" aria-hidden="true">🗺️</div>
              <div className="qa-label">{currentLangData.qa3}</div>
              <div className="qa-sub">{currentLangData.qa3s}</div>
            </button>
          </nav>
        </main>
      )}

      {screen === 'chat' && (
        <Chat
          userAlias={userAlias}
          messages={messages}
          setMessages={setMessages}
          activePeer={activePeer}
          setActivePeer={setActivePeer}
          currentLangData={currentLangData}
          lang={lang}
          onOpenPinModal={() => setPinModal(true)}
          onExit={() => {
            setActivePeer(null);
            setScreen('home');
          }}
        />
      )}

      {screen === 'peer' && (
        <main className="screen">
          <h2 className="screen-title">{currentLangData.peerTitle}</h2>
          <p className="screen-subtitle">{currentLangData.peerSub}</p>
          <div className="module-list">
            {PEER_COUNSELLORS.map((p) => (
              <article key={p.id} className="module-card">
                <div className="mod-info">
                  <h3 className="mod-title">{p.alias}</h3>
                  <p className="mod-desc">{p.specialty}</p>
                  <div className="mod-meta">
                    <span>{p.status}</span> • <span>{p.rating}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="download-btn"
                  disabled={p.status.includes('Busy')}
                  onClick={() => {
                    setActivePeer(p);
                    setScreen('chat');
                  }}
                >
                  {p.status.includes('Busy') ? 'Busy' : currentLangData.startPeerChat}
                </button>
              </article>
            ))}
          </div>
        </main>
      )}

      {screen === 'selfhelp' && (
        <main className="screen">
          <h2 className="screen-title">{currentLangData.selfHelpTitle}</h2>
          <p className="screen-subtitle">{currentLangData.selfHelpSub}</p>
          <div className="module-list">
            {SELF_HELP_MODULES.map((mod) => (
              <article key={mod.id} className="module-card">
                <div className="mod-info">
                  <h3 className="mod-title">{mod.title}</h3>
                  <p className="mod-desc">{mod.desc}</p>
                  <div className="mod-meta">
                    <span>{mod.type}</span> • <span>{mod.size}</span>
                  </div>
                </div>
                <button type="button" className="download-btn" onClick={() => downloadModule(mod)}>
                  {currentLangData.downloadBtn}
                </button>
              </article>
            ))}
          </div>
        </main>
      )}

      {screen === 'resources' && (
        <main className="screen">
          <h2 className="screen-title">{currentLangData.findSupportTitle}</h2>
          <p className="screen-subtitle">{currentLangData.findSupportSub}</p>
          <div className="dir-list">
            {SUPPORT_DIRECTORY.map((item) => (
              <article key={item.id} className="dir-card">
                <div className="dir-top">
                  <h3 className="dir-title">{item.title}</h3>
                  <span className={`dir-badge ${item.badgeClass}`}>{item.badge}</span>
                </div>
                <p className="dir-desc">{item.desc}</p>
                <div className="dir-info-block">
                  <div>{item.contact}</div>
                  <div>{item.hours}</div>
                </div>
              </article>
            ))}
          </div>
        </main>
      )}

      {screen === 'settings' && (
        <main className="screen">
          <h2 className="screen-title">{currentLangData.settingsTitle}</h2>
          <div className="settings-body">
            <section className="setting-group">
              <h3 className="setting-group-title">{currentLangData.privacySec}</h3>
              <button type="button" className="setting-row" onClick={() => setPinModal(true)}>
                <div className="setting-left">
                  <h4>{currentLangData.pinLock}</h4>
                  <p>{currentLangData.pinSub}</p>
                </div>
                <span className="setting-value">{currentLangData.setPinBtn}</span>
              </button>
            </section>
            <section className="danger-zone">
              <p>{currentLangData.dangerZone}</p>
              <button type="button" className="logout-session-btn" onClick={handleLogout}>
                {currentLangData.logoutBtn}
              </button>
            </section>
          </div>
        </main>
      )}

      {/* Enlarged High-Visibility Bottom Navigation Bar */}
      <nav className="bottom-nav" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`nav-item ${screen === item.key ? 'active' : ''}`}
            onClick={() => {
              if (item.key === 'chat') setActivePeer(null);
              setScreen(item.key);
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {pinModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>{currentLangData.pinModalTitle}</h3>
            <p>{currentLangData.pinModalSub}</p>
            <div className="pin-dots">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`pin-dot ${i < pinEntry.length ? 'filled' : ''}`}></div>
              ))}
            </div>
            <div className="pin-keypad">
              {['1','2','3','4','5','6','7','8','9'].map((n) => (
                <button key={n} type="button" className="pin-key" onClick={() => setPinEntry(pinEntry + n)}>{n}</button>
              ))}
              <button type="button" className="pin-key" onClick={() => setPinEntry(pinEntry.slice(0, -1))}>⌫</button>
              <button type="button" className="pin-key" onClick={() => setPinEntry(pinEntry + '0')}>0</button>
              <button type="button" className="pin-key" onClick={() => setPinModal(false)}>✕</button>
            </div>
            <div className="modal-btns">
              <button type="button" className="modal-btn ghost" onClick={() => setPinModal(false)}>{currentLangData.cancel}</button>
              <button type="button" className="modal-btn primary" onClick={() => { setPinModal(false); setPinEntry(''); alert('PIN Set!'); }}>{currentLangData.savePin}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}