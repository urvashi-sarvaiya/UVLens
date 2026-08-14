import React, { useState, useEffect } from 'react';

export const LoadingState = ({ fileName }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [fadeMsg, setFadeMsg] = useState(true);

  const steps = [
    { emoji: '🔍', title: 'Reading your bill...', desc: 'Extracting text and verifying structure' },
    { emoji: '🧠', title: 'Analyzing charges and line items...', desc: 'Categorizing expenses and matching rates' },
    { emoji: '✨', title: 'Spotting unusual fees...', desc: 'Auditing hidden line items and calculating totals' },
    { emoji: '📊', title: 'Finalizing your audit report...', desc: 'Preparing summary and clear explanations' }
  ];

  useEffect(() => {
    const triggerStep = (stepIdx, delay) => {
      return setTimeout(() => {
        setFadeMsg(false);
        setTimeout(() => {
          setActiveStep(stepIdx);
          setFadeMsg(true);
        }, 150);
      }, delay);
    };

    const t1 = triggerStep(1, 2800);
    const t2 = triggerStep(2, 7000);
    const t3 = triggerStep(3, 13000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const currentStep = steps[activeStep] || steps[0];

  return (
    <div className="loading-card animate-fade-in">
      <div className="loading-spinner-wrapper">
        <div className="spinner-ring"></div>
        <div className="spinner-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v1.244m0 15.308v1.244M3.104 9.75h1.244m15.308 0h1.244M4.929 4.929l.88.88m12.383 12.383l.88.88M4.929 19.071l.88-.88m12.383-12.383l.88-.88" />
          </svg>
        </div>
      </div>

      <div className="loading-header">
        <h2
          className="loading-dynamic-message"
          style={{ opacity: fadeMsg ? 1 : 0, transition: 'opacity 150ms ease-in-out' }}
        >
          {currentStep.emoji} {currentStep.title}
        </h2>
        {fileName && <p className="loading-filename">{fileName}</p>}
        <p className="loading-note">This usually takes 10 to 15 seconds. Please keep this window open.</p>
      </div>

      <div className="loading-steps">
        {steps.map((step, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`step-item ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="step-badge">
                {isDone ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : isCurrent ? (
                  <div className="step-dot-active"></div>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <div className="step-text">
                <span className="step-title">{step.title}</span>
                <span className="step-desc">{step.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingState;
