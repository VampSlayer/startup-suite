import { useState, useEffect } from 'react';
import { Settings, Sparkles, Lightbulb, Hammer, Activity } from 'lucide-react';
import { SettingsModal } from './components/shared/SettingsModal';
import IdeaScoutApp from './tools/IdeaScout/IdeaScoutApp';
import FeatureForgeApp from './tools/FeatureForge/FeatureForgeApp';
import SignalLabApp from './tools/SignalLab/SignalLabApp';
import './index.css';

type AppMode = 'HUB' | 'IDEA_SCOUT' | 'FEATURE_FORGE' | 'SIGNAL_LAB';

function App() {
  const [mode, setMode] = useState<AppMode>('HUB');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-2.5-pro');

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY') || '';
    const savedModel = localStorage.getItem('GEMINI_MODEL') || 'gemini-2.5-pro';
    setApiKey(savedKey);
    setModel(savedModel);
  }, []);

  const handleSaveSettings = (key: string, mod: string) => {
    setApiKey(key);
    setModel(mod);
  };

  const navigateHub = () => setMode('HUB');

  return (
    <>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            className="logo-container"
            onClick={navigateHub}
            style={{ cursor: 'pointer' }}
          >
            {mode === 'HUB' && <><Sparkles className="text-gradient" size={28} /><span>Startup<span className="text-gradient">Suite</span></span></>}
            {mode === 'IDEA_SCOUT' && <><Lightbulb className="text-gradient" size={28} /><span>Idea<span className="text-gradient">Scout</span></span></>}
            {mode === 'FEATURE_FORGE' && <><Hammer className="text-gradient" size={28} /><span>Feature<span className="text-gradient">Forge</span></span></>}
            {mode === 'SIGNAL_LAB' && <><Activity className="text-gradient" size={28} /><span>Signal<span className="text-gradient">Lab</span></span></>}
          </div>
          {mode !== 'HUB' && (
            <button className="btn btn-outline" onClick={navigateHub}>
              Back to Suite
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {mode === 'HUB' && (
        <main className="container flex-col gap-6 animate-fade-in" style={{ paddingBottom: '4rem', paddingTop: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1>Welcome to <span className="text-gradient">Startup Suite</span></h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Select a tool to begin planning your next big thing.</p>
            {!apiKey && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-md)', color: 'var(--color-warning)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={18} /> Please configure your API Key in Settings first.
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div
              className="glass-panel"
              style={{ padding: '2rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-border)' }}
              onClick={() => setMode('IDEA_SCOUT')}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <Lightbulb size={40} className="text-gradient" style={{ marginBottom: '1rem' }} />
              <h2 style={{ marginBottom: '0.5rem' }}>Idea Scout</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>Brainstorm, evaluate, and refine new product ideas with AI. Identifies target audience, competition, and UK grants.</p>
            </div>

            <div
              className="glass-panel"
              style={{ padding: '2rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-border)' }}
              onClick={() => setMode('FEATURE_FORGE')}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <Hammer size={40} className="text-gradient" style={{ marginBottom: '1rem' }} />
              <h2 style={{ marginBottom: '0.5rem' }}>Feature Forge</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>Break down your feature ideas into actionable engineering tasks, user stories, acceptance criteria, and test cases.</p>
            </div>

            <div
              className="glass-panel"
              style={{ padding: '2rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-border)' }}
              onClick={() => setMode('SIGNAL_LAB')}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <Activity size={40} className="text-gradient" style={{ marginBottom: '1rem' }} />
              <h2 style={{ marginBottom: '0.5rem' }}>Signal Lab</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>Validate problems and gauge demand with fake-door testing, simulated ad campaigns, and AI customer interviews.</p>
            </div>
          </div>
        </main>
      )}

      {mode === 'IDEA_SCOUT' && (
        <IdeaScoutApp
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          apiKey={apiKey}
          setApiKey={setApiKey}
          model={model}
          setModel={setModel}
        />
      )}

      {mode === 'FEATURE_FORGE' && (
        <FeatureForgeApp
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          apiKey={apiKey}
          setApiKey={setApiKey}
          model={model}
          setModel={setModel}
        />
      )}

      {mode === 'SIGNAL_LAB' && (
        <SignalLabApp
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          apiKey={apiKey}
          setApiKey={setApiKey}
          model={model}
          setModel={setModel}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />

      {mode === 'HUB' && (
        <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: 'auto' }}>
          &copy; {new Date().getFullYear()} @ Sayam Hussain
        </footer>
      )}
    </>
  );
}

export default App;
