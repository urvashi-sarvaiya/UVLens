import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { billApi } from '../api/billApi';

export const History = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [billToDelete, setBillToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const navigate = useNavigate();

  useEffect(() => {
    fetchBillHistory();
  }, []);

  const fetchBillHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await billApi.getBills();
      setBills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching bills history:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load bill history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/bill/${id}`);
  };

  const handleDeleteRequest = (e, bill) => {
    e.stopPropagation();
    setBillToDelete(bill);
  };

  const confirmDelete = async () => {
    if (!billToDelete) return;
    setIsDeleting(true);
    const targetId = billToDelete._id;

    try {
      await billApi.deleteBill(targetId);
      // Trigger smooth collapse animation before removing from state
      setDeletingId(targetId);
      setBillToDelete(null);

      setTimeout(() => {
        setBills((prev) => prev.filter((b) => b._id !== targetId));
        setDeletingId(null);
      }, 240);
    } catch (err) {
      console.error('Failed to delete bill:', err);
      alert(err.response?.data?.message || 'Failed to delete bill. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    if (!isDeleting) {
      setBillToDelete(null);
    }
  };

  const formatAmount = (amount) => {
    if (typeof amount === 'number') {
      return `$${amount.toFixed(2)}`;
    }
    return amount ? `$${amount}` : '$0.00';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const billTypes = ['ALL', ...new Set(bills.map((b) => b.bill_type).filter(Boolean))];

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      (bill.provider_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.bill_type || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || bill.bill_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="page-content animate-fade-in">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">Archive & Records</div>
          <h1 className="page-title">🧾 Bill History</h1>
          <p className="page-subtitle">
            View, inspect, and manage your past audited bills and extracted insights.
          </p>
        </div>

        <Link to="/" className="btn-primary btn-add-bill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Audit New Bill
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="error-banner animate-fade-in" style={{ marginBottom: '20px' }}>
          <div className="error-content">
            <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
          <button className="btn-secondary" onClick={fetchBillHistory}>Retry</button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="history-loading-container">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && bills.length === 0 && (
        <div className="empty-state-card animate-fade-in">
          <div className="empty-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3>📭 No bills yet — upload your first one to get started</h3>
          <p>Upload your first utility bill or invoice to start tracking spending, identifying hidden fees, and visualizing trends.</p>
          <Link to="/" className="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Upload Your First Bill
          </Link>
        </div>
      )}

      {/* Bills Content */}
      {!loading && !error && bills.length > 0 && (
        <>
          {/* Filter and Search Bar */}
          <div className="history-toolbar">
            <div className="search-input-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by provider or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>&times;</button>
              )}
            </div>

            {billTypes.length > 2 && (
              <div className="type-filter-pills">
                {billTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`filter-pill ${filterType === type ? 'active' : ''}`}
                  >
                    {type === 'ALL' ? 'All Bills' : type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredBills.length === 0 ? (
            <div className="no-matches-card animate-fade-in">
              <p>No bills found matching "<strong>{searchTerm}</strong>"</p>
              <button className="btn-secondary" onClick={() => { setSearchTerm(''); setFilterType('ALL'); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="bill-history-list">
              {filteredBills.map((bill) => (
                <div
                  key={bill._id}
                  className={`history-bill-card ${deletingId === bill._id ? 'deleting' : ''}`}
                  onClick={() => handleCardClick(bill._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCardClick(bill._id);
                    }
                  }}
                >
                  <div className="history-card-left">
                    <div className="history-type-badge">
                      {bill.bill_type || 'General'}
                    </div>
                    <div className="history-provider-info">
                      <h3 className="history-provider-name">{bill.provider_name || 'Unknown Provider'}</h3>
                      <div className="history-meta-row">
                        <span className="history-date">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Uploaded: {formatDate(bill.createdAt)}
                        </span>
                        {bill.due_date && (
                          <span className="history-due">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Due: {bill.due_date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="history-card-right">
                    <div className="history-amount-box">
                      <span className="history-amount-label">Amount</span>
                      <span className="history-amount-value">{formatAmount(bill.total_amount)}</span>
                    </div>

                    <div className="history-card-actions">
                      <button
                        className="btn-delete-icon"
                        onClick={(e) => handleDeleteRequest(e, bill)}
                        title="Delete bill"
                        aria-label={`Delete bill from ${bill.provider_name || 'provider'}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>

                      <div className="history-chevron">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {billToDelete && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-warning-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3>Delete Bill Record?</h3>
                <p>Are you sure you want to remove this bill? This action cannot be undone.</p>
              </div>
            </div>

            <div className="modal-bill-summary">
              <div className="modal-summary-row">
                <span className="summary-lbl">Provider:</span>
                <span className="summary-val">{billToDelete.provider_name || 'Unknown'}</span>
              </div>
              <div className="modal-summary-row">
                <span className="summary-lbl">Amount:</span>
                <span className="summary-val highlight">{formatAmount(billToDelete.total_amount)}</span>
              </div>
              <div className="modal-summary-row">
                <span className="summary-lbl">Type:</span>
                <span className="summary-val">{billToDelete.bill_type || 'General'}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={confirmDelete}
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

export default History;
