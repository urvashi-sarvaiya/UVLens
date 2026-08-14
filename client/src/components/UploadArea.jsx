import React, { useRef, useState } from 'react';

export const UploadArea = ({ onFileSelected, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndPassFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndPassFile(file);
    }
  };

  const validateAndPassFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';

    if (isImage || isPDF || validTypes.includes(file.type)) {
      onFileSelected(file);
    } else {
      onFileSelected(null, 'Invalid file format. Please upload an image (JPG, PNG, WebP) or a PDF file.');
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-dropzone ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          name="bill"
          style={{ display: 'none' }}
        />

        <div className="upload-icon-wrapper">
          <svg className="upload-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V3.75m0 0L7.5 8.25m4.5-4.5l4.5 4.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 15v3.75a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V15" />
          </svg>
        </div>

        <div className="upload-text-content">
          <h3 className="upload-title">Drop your bill here, or <span className="highlight-text">browse files</span></h3>
          <p className="upload-subtitle">Supports utility bills, invoices, receipts in PDF or image format</p>
        </div>

        <div className="upload-badges">
          <span className="badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316A2.192 2.192 0 0014.49 4.5h-4.98a2.192 2.192 0 00-1.864.958l-.82 1.317z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            Camera / Photo
          </span>
          <span className="badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            PDF Document
          </span>
        </div>
      </div>
    </div>
  );
};
