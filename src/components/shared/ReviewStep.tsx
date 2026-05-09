import React, { useState } from 'react';
import { Loader2, RefreshCw, CheckCircle, Wand2 } from 'lucide-react';

interface ReviewStepProps {
  title: string;
  description: string;
  isGenerating: boolean;
  onApprove: () => void;
  onRegenerate: (refinement?: string) => void;
  children: React.ReactNode;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ title, description, isGenerating, onApprove, onRegenerate, children }) => {
  const [showRefinement, setShowRefinement] = useState(false);
  const [refinementText, setRefinementText] = useState('');

  const handleRegenerate = () => {
    onRegenerate(refinementText.trim() ? refinementText : undefined);
    setShowRefinement(false);
    setRefinementText('');
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{title}</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{description}</p>
      </div>

      {isGenerating ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          <Loader2 className="loader text-gradient" size={48} style={{ marginBottom: '1rem' }} />
          <p>Scouting ideas and analyzing data...</p>
        </div>
      ) : (
        <div className="flex-col gap-6">
          {children}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            
            {showRefinement ? (
              <div className="animate-fade-in" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Optional: What should the AI do differently?
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={refinementText}
                    onChange={e => setRefinementText(e.target.value)}
                    placeholder="e.g. Focus more on B2B SaaS, use a more professional tone..."
                    autoFocus
                  />
                  <button className="btn btn-primary" onClick={handleRegenerate}>
                    <Wand2 size={16} /> Generate
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowRefinement(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="btn btn-secondary" onClick={() => setShowRefinement(true)}>
                  <RefreshCw size={18} /> Regenerate / Refine
                </button>
                <button className="btn btn-primary" onClick={onApprove}>
                  <CheckCircle size={18} /> Approve & Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
