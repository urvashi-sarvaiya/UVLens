import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ResultsView = ({ data, onReset, onBack, onDelete, isHistorical = false }) => {
  const [showOcrText, setShowOcrText] = useState(false);
  const analysis = data?.analysis || data || {};
  const ocrText = data?.ocrText || analysis?.ocrText || '';
  const originalFileName = data?.originalFileName || analysis?.originalFileName;
  const createdAt = data?.createdAt || analysis?.createdAt;

  const {
    bill_type = 'N/A',
    provider_name = 'N/A',
    billing_period = 'N/A',
    due_date = 'N/A',
    total_amount,
    line_items = [],
    flags = [],
    summary = ''
  } = analysis;

  const formattedAmount = typeof total_amount === 'number'
    ? `$${total_amount.toFixed(2)}`
    : (total_amount ? `$${total_amount}` : '$0.00');

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="results-container animate-fade-in">
      {/* Top Header Controls */}
      <div className="results-header-actions">
        <div className="results-header-left">
          {onBack ? (
            <button onClick={onBack} className="btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>Back to History</span>
            </button>
          ) : (
            <Link to="/history" className="btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>View History</span>
            </Link>
          )}

          <div className="status-pill">
            <span className="dot"></span> {isHistorical ? 'Historical Record' : 'Analysis Complete'}
          </div>
        </div>

        <div className="results-header-right">
          {onDelete && (
            <button onClick={onDelete} className="btn-danger-outline" title="Delete this bill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span>Delete</span>
            </button>
          )}

          {onReset && (
            <button onClick={onReset} className="btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Upload Another</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Overview Card */}
      <div className="overview-card">
        <div className="overview-top">
          <div className="overview-brand">
            <span className="bill-type-tag">{bill_type}</span>
            <h1 className="provider-title">{provider_name}</h1>
          </div>
          <div className="total-amount-box">
            <span className="amount-label">Total Due</span>
            <span className="amount-value">{formattedAmount}</span>
          </div>
        </div>

        <div className="overview-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Billing Period</span>
            <span className="meta-value">{billing_period}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Due Date</span>
            <span className="meta-value highlight-due">{due_date}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Line Items</span>
            <span className="meta-value">{line_items.length} items</span>
          </div>
          {formattedDate && (
            <div className="meta-item">
              <span className="meta-label">Analyzed On</span>
              <span className="meta-value">{formattedDate}</span>
            </div>
          )}
          {originalFileName && (
            <div className="meta-item">
              <span className="meta-label">Source File</span>
              <span className="meta-value" style={{ wordBreak: 'break-all', fontSize: '0.85rem' }}>{originalFileName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Unusual Charges / Flags Section (Shown only if flags exist) */}
      {flags && flags.length > 0 && (
        <div className="flags-card animate-fade-in">
          <div className="flags-header">
            <div className="flags-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3>⚠️ Unusual Charges & Potential Issues</h3>
              <p>Flagged {flags.length} item{flags.length > 1 ? 's' : ''} that require your review</p>
            </div>
          </div>

          <div className="flags-list">
            {flags.map((flag, idx) => (
              <div key={idx} className="flag-item">
                <div className="flag-item-header">
                  <span>{flag.item}</span>
                </div>
                <p className="flag-reason">{flag.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Box */}
      {summary && (
        <div className="summary-card">
          <h3 className="section-title">
            📄 Bill Summary
          </h3>
          <p className="summary-text">{summary}</p>
        </div>
      )}

      {/* Detailed Line Items with Staggered Cascading Animation */}
      <div className="line-items-section">
        <h3 className="section-title">
          💡 Line Item Breakdown
        </h3>

        <div className="line-items-grid">
          {line_items.map((item, idx) => (
            <div
              key={idx}
              className="line-item-card line-item-stagger"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="line-item-top">
                <span className="line-item-label">{item.label}</span>
                <span className="line-item-amount">
                  {typeof item.amount === 'number' ? `$${item.amount.toFixed(2)}` : (item.amount ? `$${item.amount}` : '-')}
                </span>
              </div>
              {item.plain_explanation && (
                <div className="line-item-explanation">
                  <span>{item.plain_explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Raw OCR Text Toggle */}
      {ocrText && (
        <div className="ocr-toggle-section">
          <button
            className="btn-text-link"
            onClick={() => setShowOcrText(!showOcrText)}
          >
            {showOcrText ? 'Hide Raw OCR Text' : 'View Extracted Raw OCR Text'}
          </button>

          {showOcrText && (
            <pre className="ocr-text-box animate-fade-in">{ocrText}</pre>
          )}
        </div>
      )}

      {/* Bottom Floating Action */}
      <div className="results-bottom-actions">
        {onReset ? (
          <button onClick={onReset} className="btn-primary">
            Upload Another Bill
          </button>
        ) : (
          <Link to="/history" className="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Bill History
          </Link>
        )}
      </div>
    </div>
  );
};

export default ResultsView;
