import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini AI Client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

// Dictionary Translations
const TRANSLATIONS = {
  EN: {
    privacy: 'Chats are saved on this device only. Use private browsing on shared devices.',
    h1: "You're not alone.\nHelp is here.",
    p: 'Anonymous, confidential, and in your language — 24/7.',
    uuidPrefix: 'Session: ',
    qa1: 'Chat with support', qa1s: 'AI + peer counsellors',
    qa2: 'Self-help modules', qa2s: 'Offline available',
    qa3: 'Find resources', qa3s: 'Campus + community',
    qa4: 'Peer support', qa4s: 'Talk to a trained peer',
    qa5: 'Crisis line — call now', qa5s: '0800 212 121 · Free · 24/7',
    greeting: "Hi 👋 I'm here to help. Everything you share is private and stays on your device only. What's on your mind today?",
    langName: 'English'
  },
  SW: {
    privacy: 'Mazungumzo huhifadhiwa kwenye kifaa hiki tu. Tumia kuvinjari kwa faragha kwenye vifaa vya pamoja.',
    h1: 'Hujabaki peke yako.\nMsaada uko hapa.',
    p: 'Bila jina, ya siri, na kwa lugha yako — siku 24/7.',
    uuidPrefix: 'Kipindi: ',
    qa1: 'Zungumza na msaada', qa1s: 'AI + washauri wa wenzako',
    qa2: 'Moduli za kujisaidia', qa2s: 'Inapatikana bila mtandao',
    qa3: 'Tafuta rasilimali', qa3s: 'Chuo + jamii',
    qa4: 'Msaada wa wenzako', qa4s: 'Zungumza na mwenzako',
    qa5: 'Simu ya dharura', qa5s: '0800 212 121 · Bure · 24/7',
    greeting: 'Habari 👋 Niko hapa kukusaidia. Kila unachoshiriki ni ya siri na inabaki kwenye kifaa chako tu. Unafikiria nini leo?',
    langName: 'Kiswahili'
  },
  SH: {
    privacy: 'Mazungumzo yanabaki kwa hii device peke yako. Tumia private browsing kwa shared devices.',
    h1: 'Huko solo si lazima.\nHelp iko hapa.',
    p: 'No name, ya siri, kwa lugha yako — 24/7.',
    uuidPrefix: 'Session: ',
    qa1: 'Ongea na support', qa1s: 'AI + peer counsellors',
    qa2: 'Self-help modules', qa2s: 'Works offline',
    qa3: 'Tafuta resources', qa3s: 'Campus + community',
    qa4: 'Peer support', qa4s: 'Ongea na mtu kama wewe',
    qa5: 'Crisis line — piga sasa', qa5s: '0800 212 121 · Free · 24/7',
    greeting: 'Sasa 👋 Niko hapa kukusaidia. Everything unashare ni ya siri na inabaki kwa device yako tu. Unafikiri nini leo?',
    langName: 'Sheng'
  }
};

// Custom Embedded CSS Styling
const inlineStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --sage: #4A7C59; --sage-lt: #6FA882; --sage-dk: #2D5C3F;
    --sand: #F4EFE6; --sand-dk: #E8DFC8;
    --ink: #1C1C1E; --mid: #5A5A5A; --pale: #9A9A9A;
    --white: #fff; --amber: #C97B2A; --crisis: #B83232;
    --radius: 12px; --r-sm: 8px;
  }
  body { font-family: 'Inter', system-ui, sans-serif; background: #F0EDE6; color: var(--ink); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
  .app-shell { max-width: 420px; margin: 0 auto; background: var(--white); min-height: 100vh; display: flex; flex-direction: column; position: relative; box-shadow: 0 0 40px rgba(0,0,0,.12); }

  /* NAV */
  .top-bar { background: var(--sage-dk); padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .logo { font-size: 17px; font-weight: 700; color: var(--white); letter-spacing: -.3px; }
  .logo span { color: #A8D5B5; }
  .lang-toggle { display: flex; gap: 4px; }
  .lang-btn { background: rgba(255,255,255,.15); border: none; color: rgba(255,255,255,.75); font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 20px; cursor: pointer; transition: all .15s; }
  .lang-btn.active { background: rgba(255,255,255,.9); color: var(--sage-dk); }

  /* BOTTOM NAV */
  .bottom-nav { background: var(--white); border-top: 1px solid #E5E0D8; display: flex; flex-shrink: 0; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 4px; border: none; background: none; cursor: pointer; color: var(--pale); font-size: 10px; font-weight: 500; transition: color .15s; }
  .nav-item.active { color: var(--sage); }
  .nav-item svg { width: 22px; height: 22px; stroke: currentColor; fill: none; stroke-width: 1.8; }
  .nav-item.active svg { stroke: var(--sage); }

  /* SCREENS */
  .screen { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }

  /* HOME */
  .hero-band { background: var(--sage-dk); padding: 24px 20px 32px; color: var(--white); }
  .privacy-banner { background: rgba(255,255,255,.15); border-radius: var(--r-sm); padding: 10px 14px; font-size: 12px; color: rgba(255,255,255,.85); display: flex; gap: 8px; align-items: flex-start; margin-bottom: 16px; }
  .hero-band h1 { font-size: 22px; font-weight: 700; margin-bottom: 6px; line-height: 1.25; }
  .hero-band p { font-size: 13px; color: rgba(255,255,255,.75); line-height: 1.6; }
  .uuid-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); border-radius: 20px; padding: 4px 12px; font-size: 11px; color: rgba(255,255,255,.7); margin-top: 12px; }
  .uuid-dot { width: 6px; height: 6px; background: #6FE497; border-radius: 50%; }

  .quick-actions { padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .qa-card { background: var(--sand); border-radius: var(--radius); padding: 18px 14px; border: 1.5px solid var(--sand-dk); cursor: pointer; transition: all .15s; display: flex; flex-direction: column; gap: 8px; text-align: left; }
  .qa-card:hover { border-color: var(--sage); background: #EDF5EF; }
  .qa-icon { font-size: 24px; }
  .qa-label { font-size: 13px; font-weight: 600; color: var(--ink); line-height: 1.3; }
  .qa-sub { font-size: 11px; color: var(--mid); }
  .qa-card.wide { grid-column: span 2; flex-direction: row; align-items: center; gap: 16px; background: #FFF5F5; border-color: #F5C5C5; }
  .qa-card.wide:hover { border-color: var(--crisis); background: #FFF0F0; }
  .qa-card.wide .qa-label { color: var(--crisis); }

  .section-label { padding: 0 20px 8px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: var(--pale); text-transform: uppercase; }
  .resource-list { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 8px; }
  .res-row { background: var(--sand); border-radius: var(--r-sm); padding: 14px; display: flex; align-items: center; gap: 12px; border: 1px solid var(--sand-dk); cursor: pointer; }
  .res-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .res-icon.sage { background: #E0F0E6; }
  .res-icon.blue { background: #E0EEFF; }
  .res-icon.amber { background: #FEF3E0; }
  .res-title { font-size: 13px; font-weight: 600; color: var(--ink); }
  .res-sub { font-size: 11px; color: var(--mid); }
  .res-tag { margin-left: auto; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 20px; white-space: nowrap; }
  .tag-free { background: #E0F0E6; color: #2D6B3F; }
  .tag-24 { background: #E0EEFF; color: #1A4FA0; }

  /* CHAT */
  .chat-header { background: var(--white); border-bottom: 1px solid #E5E0D8; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .chat-header-left h3 { font-size: 15px; font-weight: 600; }
  .chat-header-left p { font-size: 11px; color: var(--mid); }
  .chat-header-actions { display: flex; gap: 8px; }
  .hdr-btn { background: none; border: 1px solid #D5CFC5; border-radius: 20px; padding: 5px 12px; font-size: 11px; font-weight: 500; cursor: pointer; color: var(--mid); transition: all .15s; }
  .hdr-btn:hover { border-color: var(--sage); color: var(--sage); }
  .hdr-btn.danger:hover { border-color: var(--crisis); color: var(--crisis); }

  .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #F8F5EF; }
  .msg { max-width: 80%; display: flex; flex-direction: column; gap: 3px; }
  .msg.user { align-self: flex-end; align-items: flex-end; }
  .msg.bot { align-self: flex-start; align-items: flex-start; }
  .msg-bubble { padding: 11px 14px; border-radius: 16px; font-size: 13px; line-height: 1.55; white-space: pre-wrap; }
  .msg.user .msg-bubble { background: var(--sage); color: var(--white); border-bottom-right-radius: 4px; }
  .msg.bot .msg-bubble { background: var(--white); color: var(--ink); border-bottom-left-radius: 4px; border: 1px solid #E5E0D8; }
  .msg-time { font-size: 10px; color: var(--pale); }

  .triage-badge { background: #FEF3E0; border: 1px solid #F0D098; border-radius: var(--r-sm); padding: 10px 14px; display: flex; align-items: center; gap: 10px; font-size: 12px; color: #8A5500; }
  .triage-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .triage-dot.low { background: #4CAF50; } .triage-dot.med { background: #FF9800; } .triage-dot.high { background: #F44336; }

  .quick-replies { display: flex; gap: 8px; flex-wrap: wrap; padding: 8px 16px; }
  .qr { background: var(--white); border: 1px solid var(--sage); border-radius: 20px; padding: 7px 14px; font-size: 12px; color: var(--sage); font-weight: 500; cursor: pointer; transition: all .15s; }
  .qr:hover { background: var(--sage); color: var(--white); }

  .crisis-alert { background: #FEE8E8; border: 1px solid #F5C5C5; border-radius: var(--r-sm); margin: 8px 16px; padding: 12px 14px; display: flex; gap: 10px; align-items: flex-start; }
  .crisis-alert p { font-size: 12px; color: #8A2020; line-height: 1.5; }
  .crisis-call-btn { background: var(--crisis); color: var(--white); border: none; border-radius: var(--r-sm); padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; margin-top: 6px; }

  .chat-input-row { padding: 12px 16px; background: var(--white); border-top: 1px solid #E5E0D8; display: flex; gap: 8px; align-items: flex-end; flex-shrink: 0; }
  .chat-input { flex: 1; border: 1.5px solid #D5CFC5; border-radius: var(--r-sm); padding: 10px 14px; font-family: inherit; font-size: 13px; resize: none; outline: none; max-height: 80px; line-height: 1.5; background: var(--white); }
  .chat-input:focus { border-color: var(--sage); }
  .send-btn { background: var(--sage); border: none; border-radius: var(--r-sm); width: 40px; height: 40px; display: flex; items-center: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background .15s; }
  .send-btn:hover { background: var(--sage-dk); }
  .send-btn svg { width: 18px; height: 18px; stroke: var(--white); fill: none; stroke-width: 2; }

  /* PIN MODAL */
  .modal-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.5); z-index: 200; display: flex; align-items: center; justify-content: center; }
  .modal { background: var(--white); border-radius: var(--radius); padding: 28px 24px; width: 300px; text-align: center; }
  .modal h3 { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
  .modal p { font-size: 13px; color: var(--mid); margin-bottom: 20px; line-height: 1.6; }
  .pin-dots { display: flex; justify-content: center; gap: 12px; margin-bottom: 20px; }
  .pin-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid #D5CFC5; transition: all .15s; }
  .pin-dot.filled { background: var(--sage); border-color: var(--sage); }
  .pin-keypad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
  .pin-key { background: var(--sand); border: 1px solid var(--sand-dk); border-radius: var(--r-sm); padding: 14px; font-size: 18px; font-weight: 500; cursor: pointer; transition: all .15s; }
  .pin-key:hover { background: var(--sage); color: var(--white); border-color: var(--sage); }
  .modal-btns { display: flex; gap: 8px; }
  .modal-btn { flex: 1; border-radius: var(--r-sm); padding: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all .15s; }
  .modal-btn.primary { background: var(--sage); color: var(--white); }
  .modal-btn.ghost { background: var(--sand); color: var(--mid); }

  /* SELF HELP */
  .sh-lang-row { padding: 14px 20px; display: flex; gap: 8px; border-bottom: 1px solid #E5E0D8; }
  .sh-lang-btn { padding: 6px 16px; border-radius: 20px; border: 1.5px solid #D5CFC5; font-size: 12px; font-weight: 600; cursor: pointer; background: var(--white); color: var(--mid); transition: all .15s; }
  .sh-lang-btn.active { background: var(--sage); border-color: var(--sage); color: var(--white); }

  .module-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
  .module-card { background: var(--white); border: 1.5px solid #E5E0D8; border-radius: var(--radius); padding: 16px; cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 14px; }
  .module-card:hover { border-color: var(--sage); background: #F7FBF8; }
  .mod-icon { font-size: 26px; flex-shrink: 0; }
  .mod-info { flex: 1; }
  .mod-title { font-size: 14px; font-weight: 600; margin-bottom: 3px; }
  .mod-sub { font-size: 12px; color: var(--mid); }
  .mod-tags { display: flex; gap: 6px; margin-top: 6px; }
  .mod-tag { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
  .offline-tag { background: #E0F0E6; color: #2D6B3F; }
  .lang-tag { background: #E0EEFF; color: #1A4FA0; }
  .mod-arrow { color: var(--pale); }
  .mod-arrow svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; }

  .progress-bar { height: 4px; background: #E5E0D8; border-radius: 2px; margin: 6px 0 0; }
  .progress-fill { height: 100%; background: var(--sage); border-radius: 2px; transition: width .3s ease; }

  /* RESOURCES */
  .filter-row { padding: 12px 20px; display: flex; gap: 8px; overflow-x: auto; border-bottom: 1px solid #E5E0D8; flex-shrink: 0; }
  .filter-row::-webkit-scrollbar { display: none; }
  .fil-btn { white-space: nowrap; padding: 6px 14px; border-radius: 20px; border: 1.5px solid #D5CFC5; font-size: 12px; font-weight: 500; cursor: pointer; background: var(--white); color: var(--mid); transition: all .15s; flex-shrink: 0; }
  .fil-btn.active { background: var(--sage); border-color: var(--sage); color: var(--white); }

  .dir-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
  .dir-card { background: var(--white); border: 1.5px solid #E5E0D8; border-radius: var(--radius); padding: 16px; cursor: pointer; transition: all .15s; text-align: left; }
  .dir-card:hover { border-color: var(--sage); }
  .dir-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
  .dir-title { font-size: 14px; font-weight: 600; color: var(--ink); }
  .dir-badge { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
  .badge-crisis { background: #FEE8E8; color: #8A2020; }
  .badge-peer { background: #FEF3E0; color: #7A4800; }
  .badge-campus { background: #E0F0E6; color: #2D6B3F; }
  .badge-digital { background: #E0EEFF; color: #1A4FA0; }
  .dir-desc { font-size: 12px; color: var(--mid); line-height: 1.6; margin-bottom: 10px; }
  .dir-meta { display: flex; gap: 12px; font-size: 11px; color: var(--pale); flex-wrap: wrap; }

  /* SETTINGS */
  .settings-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
  .setting-group { background: var(--white); border: 1px solid #E5E0D8; border-radius: var(--radius); overflow: hidden; }
  .setting-group-title { padding: 12px 16px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: var(--pale); text-transform: uppercase; border-bottom: 1px solid #E5E0D8; background: var(--sand); text-align: left; }
  .setting-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #EEE8DE; cursor: pointer; transition: background .15s; text-align: left; }
  .setting-row:last-child { border-bottom: none; }
  .setting-row:hover { background: var(--sand); }
  .setting-left h4 { font-size: 13px; font-weight: 500; }
  .setting-left p { font-size: 11px; color: var(--mid); margin-top: 2px; }
  .setting-value { font-size: 12px; color: var(--sage); font-weight: 600; }
  .toggle { width: 40px; height: 22px; background: #D5CFC5; border-radius: 20px; position: relative; cursor: pointer; transition: background .2s; }
  .toggle.on { background: var(--sage); }
  .toggle::after { content: ''; position: absolute; width: 18px; height: 18px; background: var(--white); border-radius: 50%; top: 2px; left: 2px; transition: transform .2s; }
  .toggle.on::after { transform: translateX(18px); }
  .danger-zone { background: #FFF5F5; border: 1px solid #F5C5C5; border-radius: var(--radius); padding: 16px; display: flex; flex-direction: column; gap: 10px; text-align: left; }
  .danger-zone p { font-size: 12px; color: #8A2020; line-height: 1.5; }
  .end-session-btn { background: var(--crisis); color: var(--white); border: none; border-radius: var(--r-sm); padding: 12px; font-size: 13px; font-weight: 700; cursor: pointer; width: 100%; }

  /* SCREEN TITLE */
  .screen-title { padding: 18px 20px 4px; font-size: 20px; font-weight: 700; flex-shrink: 0; text-align: left; }
  .screen-subtitle { padding: 0 20px 14px; font-size: 13px; color: var(--mid); text-align: left; }
`;

export default function App() {
  const [currentLang, setCurrentLang] = useState('EN');
  const [currentScreen, setCurrentScreen] = useState('home');
  const [sessionUuid, setSessionUuid] = useState('');
  
  // Chat States
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [triageInfo, setTriageInfo] = useState({ text: 'Ready — type to begin', dot: 'low' });
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState(['Exam anxiety', 'Feeling low', 'Just talk']);

  // PIN & Locking States
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinEntry, setPinEntry] = useState('');
  const [savedPin, setSavedPin] = useState(localStorage.getItem('app_pin') || '');
  const [isLocked, setIsLocked] = useState(!!localStorage.getItem('app_pin'));

  // Module Progress States
  const [moduleProgress, setModuleProgress] = useState({ 0: 70, 1: 30, 2: 0, 3: 0, 4: 0 });
  const [resFilter, setResFilter] = useState('all');

  const L = TRANSLATIONS[currentLang];

  // Initialize Session ID
  useEffect(() => {
    let stored = localStorage.getItem('anon_session_id');
    if (!stored) {
      stored = 'anon-' + Math.random().toString(36).substring(2, 6) + '••••';
      localStorage.setItem('anon_session_id', stored);
    }
    setSessionUuid(stored);
  }, []);

  // Send Message Logic with Gemini API + Rule Triage
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMsg).trim();
    if (!query) return;

    if (isLocked) {
      setPinModalVisible(true);
      return;
    }

    const userMsgObj = { sender: 'user', text: query, time: 'Now · anonymous' };
    setMessages((prev) => [...prev, userMsgObj]);
    setInputMsg('');

    // Pre-check for crisis keywords
    const lower = query.toLowerCase();
    const isCrisis = ['suicide', 'hurt myself', 'end it', 'kill', 'die', 'kujiuua'].some((kw) => lower.includes(kw));

    if (isCrisis) {
      setTriageInfo({ text: '⚠ CRISIS · High — Escalating', dot: 'high' });
      setShowCrisisAlert(true);
    } else if (['anxious', 'anxiety', 'worried', 'stress', 'exam'].some((kw) => lower.includes(kw))) {
      setTriageInfo({ text: 'Anxiety · Medium', dot: 'med' });
    } else if (['low', 'sad', 'depressed', 'hopeless'].some((kw) => lower.includes(kw))) {
      setTriageInfo({ text: 'Low mood · Medium', dot: 'med' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are an empathetic, supportive counselor for youth. Respond in ${L.langName}.
                      User message: "${query}". Keep response clear, supportive, and under 3 sentences. 
                      If severe distress is found, offer warm support and mention crisis helpline 0800 212 121.`
              }
            ]
          }
        ]
      });

      const aiReply = response.text || L.greeting;
      setMessages((prev) => [...prev, { sender: 'bot', text: aiReply, time: 'Now · anonymous' }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I am here with you. If you're going through a tough time, please feel free to call free crisis helpline 0800 212 121.",
          time: 'Now · anonymous'
        }
      ]);
    }
  };

  // Security PIN Functions
  const handlePinPress = (val) => {
    if (pinEntry.length < 4) setPinEntry((prev) => prev + val);
  };

  const handlePinClear = () => setPinEntry((prev) => prev.slice(0, -1));

  const handleSavePin = () => {
    if (pinEntry.length === 4) {
      if (!savedPin) {
        localStorage.setItem('app_pin', pinEntry);
        setSavedPin(pinEntry);
        setIsLocked(false);
        alert('PIN set! Your chat history is protected.');
      } else {
        if (pinEntry === savedPin) {
          setIsLocked(false);
          alert('Unlocked successfully.');
        } else {
          alert('Incorrect PIN.');
        }
      }
      setPinModalVisible(false);
      setPinEntry('');
    } else {
      alert('Please enter 4 digits.');
    }
  };

  const handleEndSession = () => {
    if (window.confirm('End session and delete all data from this device? This cannot be undone.')) {
      localStorage.clear();
      setMessages([]);
      setSavedPin('');
      setIsLocked(false);
      setShowCrisisAlert(false);
      const newUuid = 'anon-' + Math.random().toString(36).substring(2, 6) + '••••';
      localStorage.setItem('anon_session_id', newUuid);
      setSessionUuid(newUuid);
      setCurrentScreen('home');
      alert('Session ended. All local data cleared.');
    }
  };

  const showCrisisCall = () => {
    alert('📞 Calling Crisis Line: 0800 212 121\nFree · Confidential · 24/7');
  };

  return (
    <>
      <style>{inlineStyles}</style>

      <div className="app-shell">
        {/* Top Navigation Bar */}
        <div className="top-bar">
          <div className="logo">MHFA<span>Connect</span></div>
          <div className="lang-toggle">
            {['EN', 'SW', 'SH'].map((lang) => (
              <button
                key={lang}
                className={`lang-btn ${currentLang === lang ? 'active' : ''}`}
                onClick={() => setCurrentLang(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* ── HOME SCREEN ── */}
        {currentScreen === 'home' && (
          <div className="screen">
            <div className="hero-band">
              <div className="privacy-banner">
                <span>🔒</span>
                <span>{L.privacy}</span>
              </div>
              <h1>{L.h1.split('\n')[0]}<br />{L.h1.split('\n')[1]}</h1>
              <p>{L.p}</p>
              <div className="uuid-pill">
                <span className="uuid-dot"></span>
                <span>{L.uuidPrefix}{sessionUuid}</span>
              </div>
            </div>

            <div className="quick-actions">
              <div className="qa-card" onClick={() => setCurrentScreen('chat')}>
                <div className="qa-icon">💬</div>
                <div className="qa-label">{L.qa1}</div>
                <div className="qa-sub">{L.qa1s}</div>
              </div>
              <div className="qa-card" onClick={() => setCurrentScreen('selfhelp')}>
                <div className="qa-icon">📚</div>
                <div className="qa-label">{L.qa2}</div>
                <div className="qa-sub">{L.qa2s}</div>
              </div>
              <div className="qa-card" onClick={() => setCurrentScreen('resources')}>
                <div className="qa-icon">🗺️</div>
                <div className="qa-label">{L.qa3}</div>
                <div className="qa-sub">{L.qa3s}</div>
              </div>
              <div className="qa-card" onClick={() => setCurrentScreen('chat')}>
                <div className="qa-icon">👥</div>
                <div className="qa-label">{L.qa4}</div>
                <div className="qa-sub">{L.qa4s}</div>
              </div>
              <div className="qa-card wide" onClick={showCrisisCall}>
                <div className="qa-icon">🆘</div>
                <div>
                  <div className="qa-label">{L.qa5}</div>
                  <div className="qa-sub">{L.qa5s}</div>
                </div>
              </div>
            </div>

            <div className="section-label">Nearby resources</div>
            <div className="resource-list">
              <div className="res-row" onClick={() => setCurrentScreen('resources')}>
                <div className="res-icon sage">🏫</div>
                <div>
                  <div className="res-title">Campus Counselling Office</div>
                  <div className="res-sub">Multimedia University · Dean of Students</div>
                </div>
                <span className="res-tag tag-free">Free</span>
              </div>
              <div className="res-row" onClick={() => setCurrentScreen('resources')}>
                <div className="res-icon blue">📱</div>
                <div>
                  <div className="res-title">Sema WhatsApp Bot</div>
                  <div className="res-sub">Anonymous · No login</div>
                </div>
                <span className="res-tag tag-24">24/7</span>
              </div>
            </div>
          </div>
        )}

        {/* ── CHAT SCREEN ── */}
        {currentScreen === 'chat' && (
          <div className="screen" style={{ overflow: 'hidden' }}>
            <div className="chat-header">
              <div className="chat-header-left">
                <h3>Anonymous Chat</h3>
                <p>AI triage active · Session secured</p>
              </div>
              <div className="chat-header-actions">
                <button className="hdr-btn" onClick={() => setPinModalVisible(true)}>
                  {isLocked ? '🔒 Unlock' : '🔒 PIN'}
                </button>
                <button className="hdr-btn danger" onClick={handleEndSession}>End</button>
              </div>
            </div>

            <div className="chat-messages">
              <div className="msg bot">
                <div className="msg-bubble">{L.greeting}</div>
                <div className="msg-time">Now · anonymous</div>
              </div>

              <div className="triage-badge">
                <span className={`triage-dot ${triageInfo.dot}`}></span>
                <span>AI triage: {triageInfo.text}</span>
              </div>

              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.sender}`}>
                  <div className="msg-bubble">{m.text}</div>
                  <div className="msg-time">{m.time}</div>
                </div>
              ))}

              {showCrisisAlert && (
                <div className="crisis-alert">
                  <div>
                    <p>🚨 <strong>Crisis support activated.</strong> Please reach out to emergency response immediately.</p>
                    <button className="crisis-call-btn" onClick={showCrisisCall}>📞 Call 0800 212 121</button>
                  </div>
                </div>
              )}
            </div>

            <div className="quick-replies">
              {quickSuggestions.map((s, idx) => (
                <div key={idx} className="qr" onClick={() => handleSendMessage(s)}>
                  {s}
                </div>
              ))}
            </div>

            <div className="chat-input-row">
              <textarea
                className="chat-input"
                placeholder="Type here — no names needed…"
                rows="1"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button className="send-btn" onClick={() => handleSendMessage()}>
                <svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* ── SELF HELP SCREEN ── */}
        {currentScreen === 'selfhelp' && (
          <div className="screen">
            <div className="screen-title">Self-Help Library</div>
            <div className="screen-subtitle">Download for offline use · Available in 3 languages</div>

            <div className="sh-lang-row">
              {['EN', 'SW', 'SH'].map((lang) => (
                <button
                  key={lang}
                  className={`sh-lang-btn ${currentLang === lang ? 'active' : ''}`}
                  onClick={() => setCurrentLang(lang)}
                >
                  {lang === 'EN' ? 'English' : lang === 'SW' ? 'Kiswahili' : 'Sheng'}
                </button>
              ))}
            </div>

            <div className="module-list">
              {[
                { title: 'Breathing exercises for anxiety', sub: '5 min · Calm your mind instantly', tags: ['⬇ Offline', 'EN/SW/SH'], icon: '🧘' },
                { title: 'Understanding your emotions', sub: '8 min · Name what you feel', tags: ['⬇ Offline', 'EN/SW'], icon: '💭' },
                { title: 'Sleep and stress management', sub: '6 min · For exam season', tags: ['⬇ Offline', 'EN'], icon: '😴' },
                { title: 'Faith and community healing', sub: '10 min · Culturally grounded', tags: ['⬇ Offline', 'EN/SW'], icon: '🤲' },
                { title: 'Substance use: know the signs', sub: '7 min · Non-judgemental', tags: ['⬇ Offline', 'EN/SW/SH'], icon: '💊' }
              ].map((mod, idx) => (
                <div
                  key={idx}
                  className="module-card"
                  onClick={() =>
                    setModuleProgress((prev) => ({
                      ...prev,
                      [idx]: Math.min((prev[idx] || 0) + 35, 100)
                    }))
                  }
                >
                  <div className="mod-icon">{mod.icon}</div>
                  <div className="mod-info">
                    <div className="mod-title">{mod.title}</div>
                    <div className="mod-sub">{mod.sub}</div>
                    <div className="mod-tags">
                      <span className="mod-tag offline-tag">{mod.tags[0]}</span>
                      <span className="mod-tag lang-tag">{mod.tags[1]}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${moduleProgress[idx] || 0}%` }}></div>
                    </div>
                  </div>
                  <div className="mod-arrow">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESOURCES SCREEN ── */}
        {currentScreen === 'resources' && (
          <div className="screen">
            <div className="screen-title">Find Support</div>
            <div className="screen-subtitle">Campus, community and digital resources near you</div>

            <div className="filter-row">
              {[
                { id: 'all', label: 'All' },
                { id: 'crisis', label: '🆘 Crisis' },
                { id: 'peer', label: '👥 Peer' },
                { id: 'campus', label: '🏫 Campus' },
                { id: 'digital', label: '📱 Digital' }
              ].map((f) => (
                <button
                  key={f.id}
                  className={`fil-btn ${resFilter === f.id ? 'active' : ''}`}
                  onClick={() => setResFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="dir-list">
              {[
                { cat: 'crisis', title: 'Uganda / Kenya Crisis Helpline', badge: 'Crisis', bClass: 'badge-crisis', desc: 'Free, confidential. Call or SMS any time. Counsellors speak English, Kiswahili, Luganda.', meta: '📞 0800 212 121 · 🕐 24/7 · 🆓 Free' },
                { cat: 'campus', title: 'Campus Counselling Office', badge: 'Campus', bClass: 'badge-campus', desc: 'University counsellors under Dean of Students. Walk-in or book appointment. Free for enrolled students.', meta: '🕐 Mon–Fri 8am–5pm · 🆓 Free' },
                { cat: 'peer', title: 'Peer Counsellor Network', badge: 'Peer', bClass: 'badge-peer', desc: 'Trained student peer supporters. Reach via WhatsApp or in-person. No appointment.', meta: '💬 WhatsApp · 🌍 EN · SW · SH · 🆓 Free' },
                { cat: 'digital', title: 'Sema Bot — Anonymous WhatsApp', badge: 'Digital', bClass: 'badge-digital', desc: 'Anonymous WhatsApp chatbot. No login, no name. Low data.', meta: '📱 WhatsApp · 🕐 24/7 · 🌍 EN · SW' }
              ]
                .filter((res) => resFilter === 'all' || res.cat === resFilter)
                .map((res, idx) => (
                  <div key={idx} className="dir-card">
                    <div className="dir-top">
                      <div className="dir-title">{res.title}</div>
                      <span className={`dir-badge ${res.bClass}`}>{res.badge}</span>
                    </div>
                    <div className="dir-desc">{res.desc}</div>
                    <div className="dir-meta">{res.meta}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS SCREEN ── */}
        {currentScreen === 'settings' && (
          <div className="screen">
            <div className="screen-title">Settings</div>
            <div className="settings-body">
              <div className="setting-group">
                <div className="setting-group-title">Privacy & Security</div>
                <div className="setting-row" onClick={() => setPinModalVisible(true)}>
                  <div className="setting-left">
                    <h4>PIN lock</h4>
                    <p>Require PIN to view chat history</p>
                  </div>
                  <span className="setting-value">{savedPin ? 'Change PIN →' : 'Set PIN →'}</span>
                </div>
                <div className="setting-row">
                  <div className="setting-left">
                    <h4>Auto-delete messages</h4>
                    <p>Clear all data after 7 days of inactivity</p>
                  </div>
                  <div className="toggle on"></div>
                </div>
              </div>

              <div className="setting-group">
                <div className="setting-group-title">Language</div>
                <div className="setting-row">
                  <div className="setting-left">
                    <h4>App language</h4>
                    <p>Content and chat language</p>
                  </div>
                  <span className="setting-value">{L.langName}</span>
                </div>
              </div>

              <div className="setting-group">
                <div className="setting-group-title">Session info</div>
                <div className="setting-row">
                  <div className="setting-left">
                    <h4>Session ID</h4>
                    <p>Anonymous — never shared</p>
                  </div>
                  <span className="setting-value">{sessionUuid}</span>
                </div>
              </div>

              <div className="danger-zone">
                <p>🔴 Ending the session clears your UUID and chat history from this device. This action cannot be undone.</p>
                <button className="end-session-btn" onClick={handleEndSession}>End Session & Delete All Data</button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <button className={`nav-item ${currentScreen === 'home' ? 'active' : ''}`} onClick={() => setCurrentScreen('home')}>
            <svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Home
          </button>
          <button className={`nav-item ${currentScreen === 'chat' ? 'active' : ''}`} onClick={() => setCurrentScreen('chat')}>
            <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Chat
          </button>
          <button className={`nav-item ${currentScreen === 'selfhelp' ? 'active' : ''}`} onClick={() => setCurrentScreen('selfhelp')}>
            <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            Self-Help
          </button>
          <button className={`nav-item ${currentScreen === 'resources' ? 'active' : ''}`} onClick={() => setCurrentScreen('resources')}>
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            Resources
          </button>
          <button className={`nav-item ${currentScreen === 'settings' ? 'active' : ''}`} onClick={() => setCurrentScreen('settings')}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            Settings
          </button>
        </div>

        {/* PIN Security Keypad Overlay Modal */}
        {pinModalVisible && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>🔒 {savedPin ? 'Enter Security PIN' : 'Set PIN lock'}</h3>
              <p>Your 4-digit PIN protects chat history on shared devices. We never store it — it stays on your device only.</p>

              <div className="pin-dots">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`pin-dot ${i < pinEntry.length ? 'filled' : ''}`}></div>
                ))}
              </div>

              <div className="pin-keypad">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
                  <button key={k} className="pin-key" onClick={() => handlePinPress(k)}>{k}</button>
                ))}
                <button className="pin-key" onClick={handlePinClear}>⌫</button>
                <button className="pin-key" onClick={() => handlePinPress('0')}>0</button>
                <button className="pin-key" onClick={() => setPinModalVisible(false)}>✕</button>
              </div>

              <div className="modal-btns">
                <button className="modal-btn ghost" onClick={() => setPinModalVisible(false)}>Cancel</button>
                <button className="modal-btn primary" onClick={handleSavePin}>
                  {savedPin ? 'Unlock' : 'Save PIN'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}