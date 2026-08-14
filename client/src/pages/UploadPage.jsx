import React, { useState, useEffect } from 'react';
import { UploadArea } from '../components/UploadArea';
import { LoadingState } from '../components/LoadingState';
import { ResultsView } from '../components/ResultsView';
import { billApi } from '../api/billApi';

export const UploadPage = () => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleResetUpload = () => {
      handleReset();
    };
    window.addEventListener('uvlens:reset-upload', handleResetUpload);
    return () => window.removeEventListener('uvlens:reset-upload', handleResetUpload);
  }, []);

  const handleFileSelected = (file, validationError) => {
    if (validationError) {
      setErrorMessage(validationError);
      setStatus('error');
      return;
    }

    if (!file) return;

    setSelectedFile(file);
    setErrorMessage('');
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setStatus('uploading');

    try {
      const data = await billApi.uploadBill(file);
      if (data) {
        setResultData(data);
        setStatus('success');
      } else {
        throw new Error('No data received from backend server.');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      const serverMsg = err.response?.data?.message;
      const errorText = serverMsg || err.message || 'Failed to upload and process bill. Please try again.';
      setErrorMessage(errorText);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResultData(null);
    setErrorMessage('');
    setStatus('idle');
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Brand Header */}
      <header className="header-brand">
        <div className="logo-badge">
          <span>🔍</span> UVLens AI
        </div>
        <h1 className="brand-title">Smart Bill Auditor</h1>
        <p className="brand-subtitle">
          Upload any utility bill, invoice, or medical receipt. Extract line items, plain-language explanations, and spot unusual hidden fees instantly.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Error Banner */}
        {errorMessage && (
          <div className="error-banner animate-fade-in" style={{ marginBottom: '20px' }}>
            <div className="error-content">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
            <button className="btn-dismiss" onClick={() => setErrorMessage('')} aria-label="Dismiss error">
              &times;
            </button>
          </div>
        )}

        {/* View Switcher based on state */}
        {status === 'idle' && (
          <UploadArea onFileSelected={handleFileSelected} disabled={false} />
        )}

        {status === 'error' && (
          <div className="error-reset-container animate-fade-in">
            <UploadArea onFileSelected={handleFileSelected} disabled={false} />
          </div>
        )}

        {status === 'uploading' && (
          <LoadingState fileName={selectedFile?.name} />
        )}

        {status === 'success' && resultData && (
          <ResultsView data={resultData} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default UploadPage;
