import React, { useState, useEffect } from 'react';
import { X, Key, Cpu } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string, model: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-2.5-pro');

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) setApiKey(savedKey);
    const savedModel = localStorage.getItem('GEMINI_MODEL');
    if (savedModel) setModel(savedModel);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    localStorage.setItem('GEMINI_MODEL', model);
    onSave(apiKey, model);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={24} className="text-gradient" />
          Settings
        </h2>

        <div className="flex-col gap-4">
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
              Gemini API Key
            </label>
            <input 
              type="password" 
              placeholder="AIzaSy..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Your key is stored securely in your browser's local storage.
            </p>
          </div>

          <div>
            <label style={{ display: 'flex', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-muted)', alignItems: 'center', gap: '0.25rem' }}>
              <Cpu size={16} /> AI Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                background: '#000000', 
                border: '1px solid var(--color-border)', 
                borderRadius: 'var(--radius-md)', 
                color: 'var(--color-text-main)',
                fontFamily: 'inherit',
                fontSize: '1rem',
                outline: 'none'
              }}
            >
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Recommended)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            </select>
          </div>
          
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={!apiKey.trim()}
            style={{ marginTop: '1rem' }}
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
