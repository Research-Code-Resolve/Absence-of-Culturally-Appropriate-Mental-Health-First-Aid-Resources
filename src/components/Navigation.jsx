import React from 'react';

export default function Navigation({ activeTab, setActiveTab, labels }) {
  const navItems = [
    { id: 'home', icon: '🏠', label: labels.home },
    { id: 'chat', icon: '💬', label: labels.chat },
    { id: 'peers', icon: '👥', label: labels.peers },
    { id: 'resources', icon: '🏥', label: labels.resources },
    { id: 'settings', icon: '⚙️', label: labels.settings }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 shadow-2xl z-50 py-2 px-4">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold scale-110 shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 font-semibold'
              }`}
              style={{ minWidth: '64px' }}
            >
              {/* Enlarged Icon */}
              <span className="text-2xl mb-1" role="img" aria-label={item.label}>
                {item.icon}
              </span>
              {/* High-Contrast Label */}
              <span className="text-xs tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}