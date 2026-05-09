import { useState } from 'react';
import { Activity, LayoutTemplate, Megaphone, Users, Award, AlertCircle } from 'lucide-react';

import { WizardStepper } from '../../components/shared/WizardStepper';
import { ReviewStep } from '../../components/shared/ReviewStep';
import { ExportPanel } from './ExportPanel';

import { 
  generateLandingPage, 
  generateAdCampaign, 
  generateInterviews, 
  generateValidationScore,
  type LandingPage,
  type AdCampaign,
  type Interview,
  type ValidationScore,
  type SignalReport
} from './services/ai';

export type WizardStep = 'INPUT' | 'LANDING_PAGE' | 'AD_CAMPAIGN' | 'INTERVIEWS' | 'VALIDATION_SCORE' | 'EXPORT';

const STEPS = [
  { id: 'INPUT', label: 'Concept' },
  { id: 'LANDING_PAGE', label: 'Landing Page' },
  { id: 'AD_CAMPAIGN', label: 'Ad Campaign' },
  { id: 'INTERVIEWS', label: 'Interviews' },
  { id: 'VALIDATION_SCORE', label: 'Score' },
  { id: 'EXPORT', label: 'Export' }
];

function SignalLabApp({ apiKey, model, setIsSettingsOpen }: any) {
  const [step, setStep] = useState<WizardStep>('INPUT');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [promptInput, setPromptInput] = useState('');
  
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [adCampaign, setAdCampaign] = useState<AdCampaign | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [validationScore, setValidationScore] = useState<ValidationScore | null>(null);

  const handleError = (err: any) => {
    console.error(err);
    setError(err.message || 'An error occurred during generation.');
    setIsGenerating(false);
  };

  const handleGenerateLandingPage = async (refinement?: string) => {
    if (!apiKey) return setIsSettingsOpen(true);
    if (!promptInput.trim()) {
      setError("Please enter a concept first.");
      return;
    }
    setError(null);
    setStep('LANDING_PAGE');
    setIsGenerating(true);
    try {
      const res = await generateLandingPage(apiKey, model, promptInput, refinement);
      setLandingPage(res);
    } catch (err) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAdCampaign = async (refinement?: string) => {
    if (!landingPage) return;
    setError(null);
    setStep('AD_CAMPAIGN');
    setIsGenerating(true);
    try {
      const res = await generateAdCampaign(apiKey, model, promptInput, landingPage, refinement);
      setAdCampaign(res);
    } catch (err) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateInterviews = async (refinement?: string) => {
    setError(null);
    setStep('INTERVIEWS');
    setIsGenerating(true);
    try {
      const res = await generateInterviews(apiKey, model, promptInput, refinement);
      setInterviews(res);
    } catch (err) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateValidationScore = async (refinement?: string) => {
    if (!adCampaign || interviews.length === 0) return;
    setError(null);
    setStep('VALIDATION_SCORE');
    setIsGenerating(true);
    try {
      const res = await generateValidationScore(apiKey, model, promptInput, adCampaign, interviews, refinement);
      setValidationScore(res);
    } catch (err) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinish = () => {
    setStep('EXPORT');
  };

  const report: SignalReport = {
    concept: promptInput,
    landingPage: landingPage || undefined,
    adCampaign: adCampaign || undefined,
    interviews,
    validationScore: validationScore || undefined
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
          <h1>Welcome to <span className="text-gradient">Signal Lab</span></h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', marginBottom: '2rem' }}>
            Simulate fake-door tests, ad campaigns, and customer interviews to see if people actually care about your idea.
          </p>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Startup Concept to Validate</label>
            <textarea 
              placeholder="e.g. A subscription service that delivers fresh roasted specialty coffee..."
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />
            <button 
              className="btn btn-primary w-full" 
              onClick={() => handleGenerateLandingPage()}
              disabled={!promptInput.trim()}
            >
              <Activity size={18} /> Start Validation Test
            </button>
          </div>
        </div>
      )}

      {step === 'LANDING_PAGE' && (
        <ReviewStep 
          title="Fake-Door Landing Page" 
          description="Here is the simulated copy for a landing page to test demand and collect waitlist signups."
          isGenerating={isGenerating}
          onRegenerate={handleGenerateLandingPage}
          onApprove={() => handleGenerateAdCampaign()}
        >
          {landingPage && (
            <div className="flex-col gap-4">
              <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{landingPage.heroHeadline}</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                  {landingPage.heroSubheadline}
                </p>
                <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <input type="email" placeholder="Email address..." disabled style={{ minWidth: '250px' }} />
                  <button className="btn btn-primary" disabled>{landingPage.waitlistCta}</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {landingPage.features.map((f, i) => (
                  <div key={i} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <LayoutTemplate size={24} className="text-gradient" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ReviewStep>
      )}

      {step === 'AD_CAMPAIGN' && (
        <ReviewStep 
          title="Simulated Ad Campaign" 
          description="We've generated mock ads and estimated industry CPC/CTR to validate how easy it is to reach your audience."
          isGenerating={isGenerating}
          onRegenerate={handleGenerateAdCampaign}
          onApprove={() => handleGenerateInterviews()}
        >
          {adCampaign && (
            <div className="flex-col gap-4">
              <div style={{ display: 'flex', gap: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Platform</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{adCampaign.platform}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Estimated CPC</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-warning)' }}>{adCampaign.estimatedCpc}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Estimated CTR</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-primary)' }}>{adCampaign.estimatedCtr}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {adCampaign.variations.map((v, i) => (
                  <div key={i} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Megaphone size={20} className="text-gradient" /> Ad Variation {i + 1}
                    </h3>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Headline</strong>
                      <p>{v.headline}</p>
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Primary Text</strong>
                      <p>{v.primaryText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ReviewStep>
      )}

      {step === 'INTERVIEWS' && (
        <ReviewStep 
          title="AI Customer Interviews" 
          description="Simulated conversations with potential customers discussing their pain points and your solution."
          isGenerating={isGenerating}
          onRegenerate={handleGenerateInterviews}
          onApprove={() => handleGenerateValidationScore()}
        >
          <div className="flex-col gap-4">
            {interviews.map((interview, i) => (
              <div key={i} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Users size={20} className="text-gradient" /> {interview.personaName}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{interview.demographic}</p>
                
                <div style={{ padding: '1rem', background: 'rgba(124, 58, 237, 0.1)', borderLeft: '3px solid var(--color-primary)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', marginBottom: '1.5rem' }}>
                  <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Key Takeaways</strong>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', margin: 0 }}>
                    {interview.keyTakeaways.map((t, idx) => <li key={idx}>{t}</li>)}
                  </ul>
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '1rem' }} className="custom-scrollbar">
                  {interview.transcript.map((turn, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: turn.speaker === 'Customer' ? 'flex-start' : 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{turn.speaker}</span>
                      <div style={{ 
                        padding: '0.75rem 1rem', 
                        borderRadius: 'var(--radius-md)', 
                        background: turn.speaker === 'Customer' ? 'rgba(0,0,0,0.3)' : 'var(--color-primary-light)',
                        border: `1px solid ${turn.speaker === 'Customer' ? 'var(--color-border)' : 'var(--color-primary)'}`,
                        maxWidth: '85%'
                      }}>
                        {turn.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ReviewStep>
      )}

      {step === 'VALIDATION_SCORE' && (
        <ReviewStep 
          title="Validation Score" 
          description="Based on the simulated ad metrics and customer interviews, here is your final validation report."
          isGenerating={isGenerating}
          onRegenerate={handleGenerateValidationScore}
          onApprove={handleFinish}
        >
          {validationScore && (
            <div className="flex-col gap-4">
              <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <Award size={48} className="text-gradient" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Score</h3>
                <div style={{ fontSize: '4rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                  {validationScore.overallScore}
                </div>
                <p style={{ fontSize: '1.25rem', fontWeight: 500, marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                  {validationScore.recommendation}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <h4 style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Problem Severity</h4>
                  <div style={{ fontSize: '2rem', fontWeight: 600 }}>{validationScore.problemSeverityScore}</div>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <h4 style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Market Demand</h4>
                  <div style={{ fontSize: '2rem', fontWeight: 600 }}>{validationScore.marketDemandScore}</div>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <h4 style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Ease of Reach</h4>
                  <div style={{ fontSize: '2rem', fontWeight: 600 }}>{validationScore.easeOfReachScore}</div>
                </div>
              </div>
            </div>
          )}
        </ReviewStep>
      )}

      {step === 'EXPORT' && <ExportPanel report={report} />}

    </main>
  );
}

export default SignalLabApp;
