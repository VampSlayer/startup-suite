import { useState } from 'react';
import { AlertCircle, BookOpen, CheckSquare, ListTodo, TestTube, CheckCircle } from 'lucide-react';
import { FeatureInput } from './components/FeatureInput';
import { ExportPanel } from './ExportPanel';
import { WizardStepper } from '../../components/shared/WizardStepper';
import { ReviewStep } from '../../components/shared/ReviewStep';
import {
  generateUserStories,
  generateTasks,
  generateAcceptanceCriteria,
  generateTestCases,
  type UserStory,
  type Task,
  type AcceptanceCriteria,
  type TestCase
} from './services/ai';

export type WizardStep = 'INPUT' | 'STORIES' | 'TASKS' | 'AC' | 'TESTS' | 'EXPORT';

const STEPS = [
  { id: 'INPUT', label: 'Idea' },
  { id: 'STORIES', label: 'Stories' },
  { id: 'TASKS', label: 'Tasks' },
  { id: 'AC', label: 'Criteria' },
  { id: 'TESTS', label: 'Tests' },
  { id: 'EXPORT', label: 'Export' }
];

function FeatureForgeApp({ apiKey, model, setIsSettingsOpen }: any) {

  const [step, setStep] = useState<WizardStep>('INPUT');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [idea, setIdea] = useState('');
  const [stories, setStories] = useState<UserStory[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [acs, setAcs] = useState<AcceptanceCriteria[]>([]);
  const [tests, setTests] = useState<TestCase[]>([]);

  // Settings handled by top-level app

  const handleError = (err: any) => {
    console.error(err);
    setError(err.message || 'An error occurred during generation.');
    setIsGenerating(false);
  };

  const handleGenerateStories = async (inputIdea: string = idea, refinement?: string) => {
    if (!apiKey) return setIsSettingsOpen(true);
    setIdea(inputIdea);
    setStep('STORIES');
    setIsGenerating(true);
    setError(null);
    try {
      const res = await generateUserStories(apiKey, model, inputIdea, refinement);
      setStories(res);
    } catch (err) { handleError(err); }
    finally { setIsGenerating(false); }
  };

  const handleGenerateTasks = async (refinement?: string) => {
    setStep('TASKS');
    setIsGenerating(true);
    setError(null);
    try {
      const res = await generateTasks(apiKey, model, stories, refinement);
      setTasks(res);
    } catch (err) { handleError(err); }
    finally { setIsGenerating(false); }
  };

  const handleGenerateAC = async (refinement?: string) => {
    setStep('AC');
    setIsGenerating(true);
    setError(null);
    try {
      const res = await generateAcceptanceCriteria(apiKey, model, stories, refinement);
      setAcs(res);
    } catch (err) { handleError(err); }
    finally { setIsGenerating(false); }
  };

  const handleGenerateTests = async (refinement?: string) => {
    setStep('TESTS');
    setIsGenerating(true);
    setError(null);
    try {
      const res = await generateTestCases(apiKey, model, stories, acs, refinement);
      setTests(res);
    } catch (err) { handleError(err); }
    finally { setIsGenerating(false); }
  };

  const finishWizard = () => {
    setStep('EXPORT');
  };

  return (
      <main className="container flex-col gap-6 animate-fade-in" style={{ paddingBottom: '4rem' }}>

        {step !== 'INPUT' && (
          <>
            <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
              <h3 style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Original Feature Idea</h3>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9375rem', color: 'var(--color-text-main)' }}>{idea}</p>
            </div>
            <WizardStepper currentStep={step} steps={STEPS} />
          </>
        )}

        {error && (
          <div style={{ padding: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {step === 'INPUT' && (
          <>
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <h1>Break down ideas into <span className="text-gradient">shippable work</span></h1>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
                Paste your feature idea and our AI Wizard will guide you step-by-step to generate User Stories, Tasks, Acceptance Criteria, and Test Cases.
              </p>
            </div>
            <FeatureInput onGenerate={handleGenerateStories} isLoading={isGenerating} />
          </>
        )}

        {step === 'STORIES' && (
          <ReviewStep
            title="Review User Stories"
            description="The AI has translated your idea into these core user stories."
            isGenerating={isGenerating}
            onRegenerate={(refinement?: string) => handleGenerateStories(idea, refinement)}
            onApprove={() => handleGenerateTasks()}
          >
            <div className="flex-col gap-4">
              {stories.map(us => (
                <div key={us.id} className="glass-panel" style={{ padding: '1rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <BookOpen size={18} className="text-gradient" />
                    <span className="text-gradient">{us.id}</span> {us.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>{us.description}</p>
                </div>
              ))}
            </div>
          </ReviewStep>
        )}

        {step === 'TASKS' && (
          <ReviewStep
            title="Review Engineering Tasks"
            description="Based on the approved stories, here are the technical tasks required."
            isGenerating={isGenerating}
            onRegenerate={handleGenerateTasks}
            onApprove={() => handleGenerateAC()}
          >
            <div className="flex-col gap-4">
              {tasks.map(t => (
                <div key={t.id} className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckSquare size={18} style={{ color: 'var(--color-secondary)' }} />
                      <span style={{ color: 'var(--color-secondary)' }}>{t.id}</span> {t.title}
                    </h3>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{t.description}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>For Story: {t.storyId}</p>
                </div>
              ))}
            </div>
          </ReviewStep>
        )}

        {step === 'AC' && (
          <ReviewStep
            title="Review Acceptance Criteria"
            description="Here is the acceptance criteria generated for your user stories."
            isGenerating={isGenerating}
            onRegenerate={handleGenerateAC}
            onApprove={() => handleGenerateTests()}
          >
            <div className="flex-col gap-4">
              {acs.map(ac => (
                <div key={ac.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '0.75rem' }}>
                  <ListTodo size={20} className="text-gradient" />
                  <div>
                    <p>{ac.description}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>For Story: {ac.storyId}</p>
                  </div>
                </div>
              ))}
            </div>
          </ReviewStep>
        )}

        {step === 'TESTS' && (
          <ReviewStep
            title="Review Test Cases"
            description="Finally, these test cases will ensure the acceptance criteria are met."
            isGenerating={isGenerating}
            onRegenerate={handleGenerateTests}
            onApprove={finishWizard}
          >
            <div className="flex-col gap-4">
              {tests.map(tc => (
                <div key={tc.id} className="glass-panel" style={{ padding: '1rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <TestTube size={18} className="text-gradient" />
                    {tc.id}: {tc.title}
                  </h3>
                  <div style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--color-border)', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>STEPS</h4>
                    <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {tc.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-success)', display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Expected Result:</span>
                    {tc.expectedResult}
                  </div>
                </div>
              ))}
            </div>
          </ReviewStep>
        )}

        {step === 'EXPORT' && (
          <div className="animate-fade-in flex-col gap-6">
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <CheckCircle size={48} className="text-gradient" style={{ margin: '0 auto 1rem' }} />
              <h2>Planning Complete!</h2>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                You've successfully generated and approved all items. You can now export them.
              </p>
              <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => {
                setIdea('');
                setStories([]);
                setTasks([]);
                setAcs([]);
                setTests([]);
                setStep('INPUT');
              }}>
                Start New Plan
              </button>
            </div>
            <ExportPanel data={{ userStories: stories, tasks, acceptanceCriteria: acs, testCases: tests }} />
          </div>
        )}

      </main>
  );
}

export default FeatureForgeApp;
