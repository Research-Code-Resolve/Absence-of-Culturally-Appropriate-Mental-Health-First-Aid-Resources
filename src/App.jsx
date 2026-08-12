import React, { useState, useEffect, useRef } from 'react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6KzsQvRAspFfu_WPkCpsBkjG7bofEvZIUdzxvm4xl9aIw";

const LANGS = {
  EN: {
    privacy: 'Chats are saved on this device only. Use private browsing on shared devices.',
    h1: "You're not alone.\nHelp is here.",
    p: 'Anonymous, confidential, and in your language — 24/7.',
    uuid: 'Session: anon-7f3a••••',
    qa1: 'Chat with support', qa1s: 'AI + peer counsellors',
    qa2: 'Self-help modules', qa2s: 'Offline available',
    qa3: 'Find resources', qa3s: 'Campus + community',
    qa4: 'Peer support', qa4s: 'Talk to a trained peer',
    qa5: 'Crisis line — call now', qa5s: '0800 212 121 · Free · 24/7',
    greeting: "Hi 👋 I'm here to help. Everything you share is private and stays on your device only. What's on your mind today?",
    lang: 'English'
  },
  SW: {
    privacy: 'Mazungumzo huhifadhiwa kwenye kifaa hiki tu. Tumia kuvinjari kwa faragha kwenye vifaa vya pamoja.',
    h1: "Hujabaki peke yako.\nMsaada uko hapa.",
    p: 'Bila jina, ya siri, na kwa lugha yako — siku 24/7.',
    uuid: 'Kipindi: anon-7f3a••••',
    qa1: 'Zungumza na msaada', qa1s: 'AI + washauri wa wenzako',
    qa2: 'Moduli za kujisaidia', qa2s: 'Inapatikana bila mtandao',
    qa3: 'Tafuta rasilimali', qa3s: 'Chuo + jamii',
    qa4: 'Msaada wa wenzako', qa4s: 'Zungumza na mwenzako',
    qa5: 'Simu ya dharura', qa5s: '0800 212 121 · Bure · 24/7',
    greeting: 'Habari 👋 Niko hapa kukusaidia. Kila unachoshiriki ni ya siri na inabaki kwenye kifaa chako tu. Unafikiria nini leo?',
    lang: 'Kiswahili'
  },
  SH: {
    privacy: 'Mazungumzo yanabaki kwa hii device peke yako. Tumia private browsing kwa shared devices.',
    h1: "Huko solo si lazima.\nHelp iko hapa.",
    p: 'No name, ya siri, kwa lugha yako — 24/7.',
    uuid: 'Session: anon-7f3a••••',
    qa1: 'Ongea na support', qa1s: 'AI + peer counsellors',
    qa2: 'Self-help modules', qa2s: 'Works offline',
    qa3: 'Tafuta resources', qa3s: 'Campus + community',
    qa4: 'Peer support', qa4s: 'Ongea na mtu kama wewe',
    qa5: 'Crisis line — piga sasa', qa5s: '0800 212 121 · Free · 24/7',
    greeting: 'Sasa 👋 Niko hapa kukusaidia. Everything unashare ni ya siri na inabaki kwa device yako tu. Unafikiri nini leo?',
    lang: 'Sheng'
  }
};

export default function App() {
  const [lang, setLang] = useState('EN');
  const [activeTab, setActiveTab] = useState('home');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [triage, setTriage] = useState({ level: 'low', text: 'Ready — type to begin' });
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinEntry, setPinEntry] = useState('');
  const [resFilter, setResFilter] = useState('all');
  const chatBottomRef = useRef(null);

  const L = LANGS[lang];

  useEffect(() => {
    setMessages([
      { id: 1, sender: 'bot', text: L.greeting, time: 'Now · anonymous' }
    ]);
  }, [lang]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text || !text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: text.trim(), time: 'Now · anonymous' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const loadingId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: loadingId, sender: 'bot', text: 'Thinking...', time: 'Now · anonymous' }]);

    const lower = text.toLowerCase();
    if (lower.includes('suicide') || lower.includes('hurt myself') || lower.includes('kill') || lower.includes('end it')) {
      setTriage({ level: 'high', text: '⚠ CRISIS — Escalating' });
    } else if (lower.includes('anxious') || lower.includes('stress') || lower.includes('low') || lower.includes('exam')) {
      setTriage({ level: 'med', text: 'Support Active · Medium Priority' });
    } else {
      setTriage({ level: 'low', text: 'Active Listener · Low Priority' });
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are an empathetic, warm mental health peer assistant for university students. Keep your response supportive, natural, concise, and non-judgmental. Understand Sheng, Kiswahili, and English. Respond in the language used. User says: ${text}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here for you. Could you share a bit more about what's on your mind?";

      setMessages((prev) =>
        prev.map((m) => (m.id === loadingId ? { ...m, text: aiReply } : m))
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, text: "I hear you, and your feelings are completely valid. I am here to support you." }
            : m
        )
      );
    }
  };

  const handlePinPress = (val) => {
    if (pinEntry.length < 4) {
      setPinEntry((prev) => prev + val);
    }
  };

  const handleSavePin = () => {
    if (pinEntry.length === 4) {
      alert('PIN set! Your chat history is protected on this device.');
      setShowPinModal(false);
      setPinEntry('');
    } else {
      alert('Please enter a 4-digit PIN.');
    }
  };

  const handleEndSession = () => {
    if (window.confirm('End session and delete all data from this device? This cannot be undone.')) {
      setMessages([]);
      localStorage.clear();
      alert('Session ended. All data cleared.');
      setActiveTab('home');
    }
  };

  return (
    <div className="max-w-[420px] mx-auto min-h-screen bg-white flex flex-col justify-between shadow-2xl relative font-sans text-stone-900 border-x border-stone-200">
      
      {/* TOP BAR */}
      <div className="bg-[#2D5C3F] px-4 py-3 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="text-white font-bold text-lg tracking-tight">
          MHFA<span className="text-[#A8D5B5]">Connect</span>
        </div>
        <div className="flex gap-1">
          {['EN', 'SW', 'SH'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`text-xs font-semibold px-2 py-1 rounded-full transition ${
                lang === l ? 'bg-white text-[#2D5C3F]' : 'bg-white/15 text-white/80 hover:bg-white/20'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* SCREEN CONTAINER */}
      <main className="flex-1 overflow-y-auto bg-stone-50 flex flex-col">
        
        {/* HOME SCREEN */}
        {activeTab === 'home' && (
          <div className="flex flex-col">
            <div className="bg-[#2D5C3F] p-5 pt-4 text-white">
              <div className="bg-white/15 rounded-lg p-3 text-xs text-white/90 flex gap-2 items-start mb-4">
                <span>🔒</span>
                <span>{L.privacy}</span>
              </div>
              <h1 className="text-xl font-bold whitespace-pre-line leading-snug mb-1">{L.h1}</h1>
              <p className="text-xs text-white/75 mb-3">{L.p}</p>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[11px] text-white/80">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span>{L.uuid}</span>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3">
              <div onClick={() => setActiveTab('chat')} className="bg-[#F4EFE6] hover:bg-[#EDF5EF] p-4 rounded-xl border border-[#E8DFC8] cursor-pointer flex flex-col gap-1 transition">
                <span className="text-xl">💬</span>
                <p className="text-xs font-bold text-stone-800">{L.qa1}</p>
                <p className="text-[11px] text-stone-500">{L.qa1s}</p>
              </div>

              <div onClick={() => setActiveTab('selfhelp')} className="bg-[#F4EFE6] hover:bg-[#EDF5EF] p-4 rounded-xl border border-[#E8DFC8] cursor-pointer flex flex-col gap-1 transition">
                <span className="text-xl">📚</span>
                <p className="text-xs font-bold text-stone-800">{L.qa2}</p>
                <p className="text-[11px] text-stone-500">{L.qa2s}</p>
              </div>

              <div onClick={() => setActiveTab('resources')} className="bg-[#F4EFE6] hover:bg-[#EDF5EF] p-4 rounded-xl border border-[#E8DFC8] cursor-pointer flex flex-col gap-1 transition">
                <span className="text-xl">🗺️</span>
                <p className="text-xs font-bold text-stone-800">{L.qa3}</p>
                <p className="text-[11px] text-stone-500">{L.qa3s}</p>
              </div>

              <div onClick={() => setActiveTab('chat')} className="bg-[#F4EFE6] hover:bg-[#EDF5EF] p-4 rounded-xl border border-[#E8DFC8] cursor-pointer flex flex-col gap-1 transition">
                <span className="text-xl">👥</span>
                <p className="text-xs font-bold text-stone-800">{L.qa4}</p>
                <p className="text-[11px] text-stone-500">{L.qa4s}</p>
              </div>

              <div onClick={() => alert('📞 Crisis Line: 0800 212 121\nFree · Confidential · 24/7')} className="col-span-2 bg-red-50 hover:bg-red-100 p-4 rounded-xl border border-red-200 cursor-pointer flex items-center gap-3 transition">
                <span className="text-2xl">🆘</span>
                <div>
                  <p className="text-xs font-bold text-red-700">{L.qa5}</p>
                  <p className="text-[11px] text-red-600">{L.qa5s}</p>
                </div>
              </div>
            </div>

            <div className="px-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2">Nearby resources</div>
            <div className="px-4 pb-4 flex flex-col gap-2">
              <div className="bg-[#F4EFE6] rounded-lg p-3 flex items-center gap-3 border border-[#E8DFC8]">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-base">🏫</div>
                <div>
                  <p className="text-xs font-bold text-stone-800">Campus Counselling Office</p>
                  <p className="text-[11px] text-stone-500">Multimedia University · Dean of Students</p>
                </div>
                <span className="ml-auto text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Free</span>
              </div>
            </div>
          </div>
        )}

        {/* CHAT SCREEN */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-full bg-[#F8F5EF] min-h-[480px]">
            <div className="bg-white p-3 border-b border-stone-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xs text-stone-800">Anonymous Chat</h3>
                <p className="text-[10px] text-stone-500">Live Gemini AI · Session secured</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setShowPinModal(true)} className="border border-stone-300 rounded-full px-2.5 py-1 text-[11px] text-stone-600 hover:border-[#2D5C3F]">🔒 PIN</button>
                <button onClick={handleEndSession} className="border border-red-300 rounded-full px-2.5 py-1 text-[11px] text-red-600 hover:bg-red-50">End</button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-[300px]">
              {messages.map((m) => (
                <div key={m.id} className={`max-w-[80%] flex flex-col gap-1 ${m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === 'user' ? 'bg-[#4A7C59] text-white rounded-br-none' : 'bg-white text-stone-800 border border-stone-200 shadow-sm rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] text-stone-400 px-1">{m.time}</span>
                </div>
              ))}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center gap-2 text-xs text-amber-800 my-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  triage.level === 'high' ? 'bg-red-500' : triage.level === 'med' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
                <span className="text-[11px] font-medium">AI triage: {triage.text}</span>
              </div>
              <div ref={chatBottomRef} />
            </div>

            <div className="px-3 py-1 flex gap-2 overflow-x-auto bg-[#F8F5EF]">
              <button onClick={() => handleSendMessage('I feel anxious about exams')} className="border border-[#4A7C59] text-[#4A7C59] bg-white rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap hover:bg-[#4A7C59] hover:text-white">😰 Exam anxiety</button>
              <button onClick={() => handleSendMessage('I feel really low lately')} className="border border-[#4A7C59] text-[#4A7C59] bg-white rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap hover:bg-[#4A7C59] hover:text-white">😔 Feeling low</button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-white border-t border-stone-200 flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here — ask anything in EN, SW, or Sheng…"
                className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#4A7C59]"
              />
              <button type="submit" className="bg-[#4A7C59] hover:bg-[#2D5C3F] text-white p-2.5 rounded-lg transition">➔</button>
            </form>
          </div>
        )}

        {/* SELF HELP SCREEN */}
        {activeTab === 'selfhelp' && (
          <div className="p-4 flex flex-col gap-3">
            <h2 className="text-lg font-bold text-stone-800">Self-Help Library</h2>
            <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-stone-800">Breathing exercises for anxiety</p>
                <p className="text-[11px] text-stone-500">5 min · Calm your mind instantly</p>
              </div>
              <span className="text-stone-400">➔</span>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-stone-800">Understanding your emotions</p>
                <p className="text-[11px] text-stone-500">8 min · Name what you feel</p>
              </div>
              <span className="text-stone-400">➔</span>
            </div>
          </div>
        )}

        {/* RESOURCES SCREEN */}
        {activeTab === 'resources' && (
          <div className="p-4 flex flex-col gap-3">
            <h2 className="text-lg font-bold text-stone-800">Find Support</h2>
            <div className="bg-white border border-stone-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-stone-800 mb-1">Campus Counselling Office</h4>
              <p className="text-[11px] text-stone-600 mb-2">Free confidential support for university students.</p>
              <p className="text-[11px] font-bold text-[#4A7C59]">📞 0800 212 121 · 24/7 Helpline</p>
            </div>
          </div>
        )}

        {/* SETTINGS SCREEN */}
        {activeTab === 'settings' && (
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-stone-800">Settings</h2>
            <button onClick={() => setShowPinModal(true)} className="bg-white border border-stone-300 p-3 rounded-lg text-xs font-bold text-left">🔒 Set PIN Lock</button>
            <button onClick={handleEndSession} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-lg transition">End Session & Delete Local Data</button>
          </div>
        )}
      </main>

      {/* PIN MODAL */}
      {showPinModal && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[280px] text-center">
            <h3 className="font-bold text-base mb-1">🔒 Set PIN Lock</h3>
            <p className="text-xs text-stone-500 mb-4">Enter a 4-digit PIN to secure your chat history.</p>
            <div className="flex justify-center gap-3 mb-4">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className={`w-3.5 h-3.5 rounded-full border-2 border-stone-300 ${pinEntry.length > idx ? 'bg-[#4A7C59] border-[#4A7C59]' : ''}`}></div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1','2','3','4','5','6','7','8','9'].map((n) => (
                <button key={n} onClick={() => handlePinPress(n)} className="bg-stone-100 py-2.5 rounded-lg font-bold text-stone-700">{n}</button>
              ))}
              <button onClick={() => setPinEntry(pinEntry.slice(0, -1))} className="bg-stone-100 py-2.5 rounded-lg font-bold text-stone-700">⌫</button>
              <button onClick={() => handlePinPress('0')} className="bg-stone-100 py-2.5 rounded-lg font-bold text-stone-700">0</button>
              <button onClick={() => setShowPinModal(false)} className="bg-stone-100 py-2.5 rounded-lg font-bold text-stone-700">✕</button>
            </div>
            <button onClick={handleSavePin} className="w-full bg-[#4A7C59] text-white py-2 rounded-lg text-xs font-bold">Save PIN</button>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav className="bg-white border-t border-stone-200 flex justify-around p-2 shrink-0 sticky bottom-0 z-40">
        {[
          { id: 'home', label: 'Home', icon: '🏠' },
          { id: 'chat', label: 'Chat', icon: '💬' },
          { id: 'selfhelp', label: 'Self-Help', icon: '📚' },
          { id: 'resources', label: 'Resources', icon: '🗺️' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
        ].map((nav) => (
          <button
            key={nav.id}
            onClick={() => setActiveTab(nav.id)}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
              activeTab === nav.id ? 'text-[#4A7C59]' : 'text-stone-400'
            }`}
          >
            <span className="text-lg">{nav.icon}</span>
            <span>{nav.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}