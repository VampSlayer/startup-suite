import React, { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';

interface FeatureInputProps {
  onGenerate: (idea: string) => void;
  isLoading: boolean;
}

export const FeatureInput: React.FC<FeatureInputProps> = ({ onGenerate, isLoading }) => {
  const [idea, setIdea] = useState('');

  const handleGenerate = () => {
    if (idea.trim()) {
      onGenerate(idea.trim());
    }
  };

  return (
    <div className="glass-panel flex-col gap-4" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label htmlFor="featureIdea" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
        Describe your feature
      </label>
      <textarea
        id="featureIdea"
        rows={6}
        placeholder="E.g., I want to build a user profile page where users can upload an avatar, edit their bio, and see their recent activity..."
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        disabled={isLoading}
        style={{ resize: 'vertical', minHeight: '120px' }}
      />
      <div className="flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleGenerate} 
          disabled={!idea.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="loader" size={20} />
              <span>Generating Plan...</span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              <span>Generate Breakdown</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
