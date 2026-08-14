import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ResultsView } from '../components/ResultsView';
import { billApi } from '../api/billApi';

export const BillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBillDetails(id);
    }
  }, [id]);

  const fetchBillDetails = async (billId) => {
    setLoading(true);
    setError('');
    try {
      const data = await billApi.getBillById(billId);
      setBill(data);
    } catch (err) {
      console.error('Error fetching bill detail:', err);
      const serverMsg = err.response?.data?.message;
      setError(serverMsg || err.message || 'Could not find or load the requested bill.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await billApi.deleteBill(id);
      navigate('/history');
    } catch (err) {
      console.error('Error deleting bill:', err);
      alert(err.response?.data?.message || 'Failed to delete bill.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Loading state */}
      {loading && (
        <div className="detail-loading-wrapper">
          <div className="loading-spinner-wrapper">
            <div className="spinner-ring"></div>
            <div className="spinner-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
          </div>
          <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading bill details...</p>
        </div>
      )}

      {/* Error / Not Found state */}
      {!loading && error && (
        <div className="detail-error-card animate-fade-in">
          <div className="error-icon-big">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2>Bill Not Found</h2>
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
            <Link to="/history" className="btn-secondary">
              Back to History
            </Link>
            <button onClick={() => fetchBillDetails(id)} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Bill Content */}
      {!loading && !error && bill && (
        <ResultsView
          data={bill}
          onBack={() => navigate('/history')}
          onDelete={() => setShowDeleteModal(true)}
          isHistorical={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => !isDeleting && setShowDeleteModal(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-warning-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3>Delete Bill?</h3>
                <p>Are you sure you want to delete this bill record from your history?</p>
              </div>
            </div>

            <div className="modal-bill-summary">
              <div className="modal-summary-row">
                <span className="summary-lbl">Provider:</span>
                <span className="summary-val">{bill?.provider_name || 'N/A'}</span>
              </div>
              <div className="modal-summary-row">
                <span className="summary-lbl">Total Amount:</span>
                <span className="summary-val highlight">
                  {typeof bill?.total_amount === 'number' ? `$${bill.total_amount.toFixed(2)}` : bill?.total_amount || '$0.00'}
                </span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetail;
