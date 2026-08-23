import React from 'react';
import { SELF_HELP_MODULES } from '../constants';

export default function SelfHelp({ currentLangData, onDownload }) {
  return (
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
            <button type="button" className="download-btn" onClick={() => onDownload(mod)}>
              {currentLangData.downloadBtn}
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}