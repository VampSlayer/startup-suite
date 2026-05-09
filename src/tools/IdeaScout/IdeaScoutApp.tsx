import { useState } from 'react';
import { Sparkles, Lightbulb, Users, Target, Presentation, AlertCircle, Landmark } from 'lucide-react';

import { WizardStepper } from '../../components/shared/WizardStepper';
import { ReviewStep } from '../../components/shared/ReviewStep';
import { ExportPanel } from './ExportPanel';

import { 
  generateIdeas, 
  generateAudience, 
  generateCompetition, 
  generatePitch,
  generateGrants,
  type Idea,
  type AudiencePersona,
  type Competitor,
  type Pitch,
  type Grant,
  type ScoutReport
} from './services/ai';

export type WizardStep = 'INPUT' | 'IDEAS' | 'AUDIENCE' | 'COMPETITION' | 'PITCH' | 'GRANTS' | 'EXPORT';

const STEPS = [
  { id: 'INPUT', label: 'Idea' },
  { id: 'IDEAS', label: 'Brainstorm' },
  { id: 'AUDIENCE', label: 'Audience' },
  { id: 'COMPETITION', label: 'Competition' },
  { id: 'PITCH', label: 'Pitch' },
  { id: 'GRANTS', label: 'Grants' },
  { id: 'EXPORT', label: 'Export' }
];

function IdeaScoutApp({ apiKey, model, setIsSettingsOpen }: any) {
  const [step, setStep] = useState<WizardStep>('INPUT');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [promptInput, setPromptInput] = useState('');
  
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [audience, setAudience] = useState<AudiencePersona[]>([]);
  const [competition, setCompetition] = useState<Competitor[]>([]);
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [grants, setGrants] = useState<Grant[]>([]);

  const handleError = (err: any) => {
    console.error(err);
    setError(err.message || 'An error occurred during generation.');
    setIsGenerating(false);
  };

  const handleGenerateIdeas = async (refinement?: string) => {
    if (!apiKey) return setIsSettingsOpen(true);
    if (!promptInput.trim()) {
      setError("Please enter an idea or concept first.");
      return;
    }
    setError(null);
    setStep('IDEAS');
    setIsGenerating(true);
    try {
      const res = await generateIdeas(apiKey, model, promptInput, refinement);
      setIdeas(res);
      if (res.length > 0) setSelectedIdeaId(res[0].id);
    } catch (err) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getSelectedIdea = () => ideas.find(i => i.id === selectedIdeaId) || ideas[0];

  const handleGenerateAudience = async (refinement?: string) => {
    setError(null);
    setStep('AUDIENCE');
    setIsGenerating(true);
    try {
      const res = await generateAudience(apiKey, model, getSelectedIdea(), refinement);
      setAudience(res);
    } catch (err) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCompetition = async (refinement?: string) => {
    setError(null);
    setStep('COMPETITION');
    setIsGenerating(true);
    try {
      const res = await generateCompetition(apiKey, model, getSelectedIdea(), refinement);
      setCompetition(res);
    } catch (err) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePitch = async (refinement?: string) => {
    setError(null);
    setStep('PITCH');
    setIsGenerating(true);
    try {
      const res = await generatePitch(apiKey, model, getSelectedIdea(), audience, competition, refinement);
      setPitch(res);
    } catch (err) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateGrants = async (refinement?: string) => {
    setError(null);
    setStep('GRANTS');
    setIsGenerating(true);
    try {
      const res = await generateGrants(apiKey, model, getSelectedIdea(), refinement);
      setGrants(res);
    } catch (err) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinish = () => {
    setStep('EXPORT');
  };

  const scoutReport: ScoutReport = {
    ideas,
    selectedIdea: getSelectedIdea(),
    audience,
    competition,
    pitch: pitch || undefined,
    grants
  };

  return (
      <main className="container flex-col gap-6 animate-fade-in" style={{ paddingBottom: '4rem' }}>
        
        {step !== 'INPUT' && (
          <>
            <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
              <h3 style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Original Concept
              </h3>
              <p style={{ fontWeight: 500 }}>{promptInput}</p>
            </div>
            <WizardStepper currentStep={step} steps={STEPS} />
          </>
        )}

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {step === 'INPUT' && (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1>Welcome to <span className="text-gradient">Idea Scout</span></h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', marginBottom: '2rem' }}>
              Enter a problem space, industry, or rough concept, and let AI brainstorm and evaluate it for you.
            </p>
            
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Concept or Problem Space</label>
              <textarea 
                placeholder="e.g. A tool for independent coffee shops to manage their supply chain..."
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                style={{ marginBottom: '1rem' }}
              />
              <button 
                className="btn btn-primary w-full" 
                onClick={() => handleGenerateIdeas()}
                disabled={!promptInput.trim()}
              >
                <Sparkles size={18} /> Start Scouting
              </button>
            </div>
          </div>
        )}

        {step === 'IDEAS' && (
          <ReviewStep 
            title="Review Brainstormed Ideas" 
            description="The AI has generated a few distinct product ideas based on your concept. Select the one you want to pursue."
            isGenerating={isGenerating}
            onRegenerate={handleGenerateIdeas}
            onApprove={() => handleGenerateAudience()}
          >
            <div className="flex-col gap-4">
              {ideas.map((idea) => (
                <div 
                  key={idea.id} 
                  style={{ 
                    padding: '1.5rem', 
                    background: selectedIdeaId === idea.id ? 'var(--color-primary-light)' : 'rgba(0,0,0,0.2)', 
                    border: `1px solid ${selectedIdeaId === idea.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSelectedIdeaId(idea.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Lightbulb size={20} className="text-gradient" /> {idea.title}
                    </h3>
                    <div style={{ 
                      width: '1.25rem', height: '1.25rem', borderRadius: '50%', 
                      border: `2px solid ${selectedIdeaId === idea.id ? 'var(--color-primary)' : 'var(--color-text-muted)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {selectedIdeaId === idea.id && <div style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', background: 'var(--color-primary)' }} />}
                    </div>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{idea.description}</p>
                  <div style={{ fontSize: '0.875rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                    <strong>Market Potential:</strong> {idea.marketPotential}
                  </div>
                </div>
              ))}
            </div>
          </ReviewStep>
        )}

        {step === 'AUDIENCE' && (
          <ReviewStep 
            title="Review Target Audience" 
            description="Here are the potential user personas for your selected idea."
            isGenerating={isGenerating}
            onRegenerate={handleGenerateAudience}
            onApprove={() => handleGenerateCompetition()}
          >
            <div className="flex-col gap-4">
              {audience.map((a) => (
                <div key={a.id} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Users size={20} className="text-gradient" /> {a.name}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{a.demographic}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Pain Points</h4>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                        {a.painPoints.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Goals</h4>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                        {a.goals.map((g, i) => <li key={i}>{g}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ReviewStep>
        )}

        {step === 'COMPETITION' && (
          <ReviewStep 
            title="Review Competition" 
            description="These are the potential competitors for your idea."
            isGenerating={isGenerating}
            onRegenerate={handleGenerateCompetition}
            onApprove={() => handleGeneratePitch()}
          >
            <div className="flex-col gap-4">
              {competition.map((c) => (
                <div key={c.id} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Target size={20} className="text-gradient" /> {c.name}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Strengths</h4>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                        {c.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Weaknesses</h4>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                        {c.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  </div>
                  
                  <div style={{ padding: '0.75rem', background: 'rgba(124, 58, 237, 0.1)', borderLeft: '3px solid var(--color-primary)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>How we differentiate:</strong>
                    <span style={{ fontSize: '0.9rem' }}>{c.differentiation}</span>
                  </div>
                </div>
              ))}
            </div>
          </ReviewStep>
        )}

        {step === 'PITCH' && (
          <ReviewStep 
            title="Review Pitch" 
            description="Based on the audience and competition, here is the final pitch for your idea."
            isGenerating={isGenerating}
            onRegenerate={handleGeneratePitch}
            onApprove={() => handleGenerateGrants()}
          >
            {pitch && (
              <div className="flex-col gap-4">
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Presentation size={20} className="text-gradient" /> Elevator Pitch
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>{pitch.elevatorPitch}</p>
                </div>
                
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>Value Proposition</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>{pitch.valueProposition}</p>
                </div>

                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>Key Features</h3>
                  <ul style={{ paddingLeft: '1.25rem' }}>
                    {pitch.keyFeatures.map((f, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{f}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </ReviewStep>
        )}

        {step === 'GRANTS' && (
          <ReviewStep 
            title="Review Grants" 
            description="Here are some potential UK government grants that this idea might qualify for."
            isGenerating={isGenerating}
            onRegenerate={handleGenerateGrants}
            onApprove={handleFinish}
          >
            <div className="flex-col gap-4">
              {grants.map((g) => (
                <div key={g.id} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Landmark size={20} className="text-gradient" /> {g.name}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Provider</h4>
                      <p style={{ fontSize: '0.9rem' }}>{g.provider}</p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Amount</h4>
                      <p style={{ fontSize: '0.9rem' }}>{g.amount}</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Eligibility</h4>
                    <p style={{ fontSize: '0.9rem' }}>{g.eligibility}</p>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(124, 58, 237, 0.1)', borderLeft: '3px solid var(--color-primary)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>Alignment:</strong>
                    <span style={{ fontSize: '0.9rem' }}>{g.alignment}</span>
                  </div>
                </div>
              ))}
            </div>
          </ReviewStep>
        )}

        {step === 'EXPORT' && <ExportPanel report={scoutReport} />}

      </main>
  );
}

export default IdeaScoutApp;
