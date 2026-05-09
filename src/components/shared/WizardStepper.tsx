import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
}

interface WizardStepperProps {
  currentStep: string;
  steps: Step[];
}

export const WizardStepper: React.FC<WizardStepperProps> = ({ currentStep, steps }) => {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '4rem' }}>
                <div 
                  style={{ 
                    width: '2rem', 
                    height: '2rem', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: isCompleted ? 'var(--color-primary)' : isCurrent ? 'var(--color-bg-base)' : 'var(--color-bg-base)',
                    border: `2px solid ${isCompleted || isCurrent ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    color: isCompleted ? 'white' : isCurrent ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none'
                  }}
                >
                  {isCompleted ? <Check size={14} /> : index + 1}
                </div>
                <span style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.75rem', 
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent || isCompleted ? 'var(--color-text-main)' : 'var(--color-text-muted)'
                }}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div style={{ flex: 1, height: '2px', background: 'var(--color-border)', position: 'relative', top: '-10px', zIndex: 1, margin: '0 -1rem' }}>
                  <div style={{ 
                    height: '100%', 
                    background: 'var(--color-primary)', 
                    width: isCompleted ? '100%' : '0%',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
