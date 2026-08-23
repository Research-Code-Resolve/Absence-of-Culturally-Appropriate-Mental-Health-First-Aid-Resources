import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export default function Chat({ userAlias = 'cana', activePeer = null, onExit }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const targetRecipient = activePeer ? activePeer.alias : 'AI Support Bot';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    async function fetchMessages() {
      setIsLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`recipient.eq.${targetRecipient},alias.eq.${targetRecipient},alias.eq.${userAlias}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Fetch error:', error);
        setErrorMessage('Failed to load message history. Please check your connection.');
      } else if (data) {
        setMessages(data);
      }
      setIsLoading(false);
    }

    fetchMessages();

    const channel = supabase
      .channel(`realtime:messages:${targetRecipient}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new;
          if (
            newMsg.recipient === targetRecipient ||
            newMsg.alias === targetRecipient ||
            newMsg.alias === userAlias
          ) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activePeer, userAlias, targetRecipient]);

  const generateHumanResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('tired') || lower.includes('exhausted')) {
      return "I completely hear you. Balancing everything can be draining. Take a quick break today!";
    }
    if (lower.includes('hi') || lower.includes('hello')) {
      return "Hey there! I'm really glad you reached out. How are things going today?";
    }
    return "I hear you. What's taking up the most space in your head right now?";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    setErrorMessage(null);

    const { data: userData, error: userError } = await supabase
      .from('messages')
      .insert([{ alias: userAlias, content: userText, sender: 'user', recipient: targetRecipient }])
      .select();

    if (userError) {
      setErrorMessage('Failed to send message. Please try again.');
      return;
    }

    if (userData) {
      setMessages((prev) => [...prev, ...userData]);
    }

    if (!activePeer) {
      setIsTyping(true);

      try {
        if (!ai) {
          throw new Error('Missing VITE_GEMINI_API_KEY');
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userText,
          config: {
            systemInstruction: 'You are a supportive, empathetic, and friendly AI peer support assistant for students.'
          }
        });

        const aiReplyText = response.text || generateHumanResponse(userText);

        const { data: aiData, error: aiError } = await supabase
          .from('messages')
          .insert([{ alias: 'AI Support Bot', content: aiReplyText, sender: 'bot', recipient: userAlias }])
          .select();

        if (aiError) {
          console.error('Supabase AI Save Error:', aiError);
        } else if (aiData) {
          setMessages((prev) => [...prev, ...aiData]);
        }
      } catch (err) {
        console.error('Gemini Execution Error:', err);
        const fallbackText = generateHumanResponse(userText);
        const { data: fallbackData } = await supabase
          .from('messages')
          .insert([{ alias: 'AI Support Bot', content: fallbackText, sender: 'bot', recipient: userAlias }])
          .select();

        if (fallbackData) {
          setMessages((prev) => [...prev, ...fallbackData]);
        }
      } finally {
        setIsTyping(false);
      }
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="screen" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '16px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem', color: '#0f172a' }}>
            {activePeer ? activePeer.alias : 'AI Support Bot'}
          </h3>
          <span style={{ fontSize: '0.8rem', color: activePeer ? '#4f46e5' : '#16a34a', fontWeight: 'bold' }}>
            {activePeer ? `● Connected with Counselor` : '● Active 24/7'}
          </span>
        </div>
        <button type="button" onClick={onExit} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Exit Chat
        </button>
      </div>

      {/* Error Banner State */}
      {errorMessage && (
        <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.85rem' }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Peer Info Banner */}
      {activePeer && (
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.8rem', color: '#1e40af' }}>
          💬 Direct session regarding <strong>{activePeer.specialty}</strong>
        </div>
      )}

      {/* Main Messages Feed with Loading & Empty States */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', paddingRight: '4px' }}>
        {isLoading ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: '#64748b' }}>
            <p style={{ fontSize: '0.9rem' }}>⏳ Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: '#64748b', padding: '20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</div>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#334155' }}>No messages yet</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>Send a message to start the conversation safely and anonymously.</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={m.id || i}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: m.sender === 'user' ? '#4f46e5' : '#f1f5f9',
                color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                padding: '10px 14px',
                borderRadius: '12px',
                maxWidth: '80%'
              }}
            >
              <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '2px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <span>{m.alias}</span>
                {m.created_at && <span>{formatTime(m.created_at)}</span>}
              </div>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{m.content}</div>
            </div>
          ))
        )}

        {isTyping && (
          <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>
            AI Support Bot is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Accessible Input Form */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          aria-label="Type your message"
          placeholder={activePeer ? `Message ${activePeer.alias}...` : "Write message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
        />
        <button type="submit" disabled={isTyping} style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </main>
  );
}