import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function PeerCounselors({ userAlias = 'cana', onSelectPeer, onStartAiChat }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);

  // Peer Counselors Directory
  const [counselors, setCounselors] = useState([
    {
      id: 1,
      alias: 'Peer Helper Kila',
      specialty: 'Academic Stress & Burnout',
      category: 'Academic',
      status: 'Available',
      rating: '4.9',
      reviews: 28,
      bio: 'Final-year student peer counselor specializing in time management, exam anxiety, and burnout recovery.',
      avatar: '🎓'
    },
    {
      id: 2,
      alias: 'Peer Helper Thabo',
      specialty: 'Anxiety & Adjustment Support',
      category: 'Mental Health',
      status: 'Busy',
      rating: '4.8',
      reviews: 34,
      bio: 'Trained in active listening and grounding techniques to help navigate university transitions and anxiety.',
      avatar: '🌱'
    },
    {
      id: 3,
      alias: 'Peer Helper Lerato',
      specialty: 'Relationships & Campus Life',
      category: 'Social',
      status: 'Available',
      rating: '5.0',
      reviews: 19,
      bio: 'Here to listen confidentially regarding social dynamics, family pressure, and interpersonal issues.',
      avatar: '🤝'
    }
  ]);

  // Compute live available counselor count
  useEffect(() => {
    const available = counselors.filter(c => c.status === 'Available').length;
    setOnlineCount(available);
  }, [counselors]);

  // Filter counselors by category search query
  const filteredCounselors = counselors.filter((peer) => {
    const matchesCategory = selectedCategory === 'All' || peer.category === selectedCategory;
    const matchesSearch = peer.alias.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          peer.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1.4rem' }}>
              Peer Support Counselors
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              Connect confidentially with trained student peer supporters.
            </p>
          </div>
          <button
            onClick={onStartAiChat}
            style={{
              backgroundColor: '#e0e7ff',
              color: '#4338ca',
              border: '1px solid #c7d2fe',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            🤖 Chat with AI Bot
          </button>
        </div>

        {/* Live Availability Status Strip */}
        <div style={{ 
          marginTop: '12px', 
          backgroundColor: '#f0fdf4', 
          border: '1px solid #bbf7d0', 
          padding: '8px 12px', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '0.825rem',
          color: '#166534'
        }}>
          <span>●</span>
          <strong>{onlineCount} Counselors Online Now</strong> — Private, peer-to-peer end-to-end sessions.
        </div>
      </div>

      {/* Filter Options & Search */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search counselor or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem'
          }}
        />

        {['All', 'Academic', 'Mental Health', 'Social'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              backgroundColor: selectedCategory === cat ? '#4f46e5' : '#f1f5f9',
              color: selectedCategory === cat ? '#ffffff' : '#475569',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.825rem'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Counselor Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredCounselors.map((counselor) => {
          const isAvailable = counselor.status === 'Available';

          return (
            <div
              key={counselor.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'border-color 0.2s ease'
              }}
            >
              <div>
                {/* Counselor Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.8rem', backgroundColor: '#f8fafc', padding: '6px', borderRadius: '50%' }}>
                      {counselor.avatar}
                    </span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>
                        {counselor.alias}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        ★ {counselor.rating} ({counselor.reviews} chats)
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator Badge */}
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 'bold',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      backgroundColor: isAvailable ? '#dcfce7' : '#fef3c7',
                      color: isAvailable ? '#15803d' : '#b45309'
                    }}
                  >
                    {isAvailable ? '● Available' : '● Busy'}
                  </span>
                </div>

                {/* Specialty Banner */}
                <div style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: '600', 
                  color: '#4338ca', 
                  backgroundColor: '#eef2ff', 
                  padding: '4px 8px', 
                  borderRadius: '6px',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}>
                  {counselor.specialty}
                </div>

                {/* Short Biography */}
                <p style={{ margin: '0 0 16px 0', fontSize: '0.825rem', color: '#475569', lineHeight: '1.4' }}>
                  {counselor.bio}
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelectPeer(counselor)}
                style={{
                  width: '100%',
                  backgroundColor: isAvailable ? '#4f46e5' : '#cbd5e1',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s'
                }}
              >
                {isAvailable ? 'Start Confidential Chat' : 'Currently in Session'}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}