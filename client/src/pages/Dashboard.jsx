import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { billApi } from '../api/billApi';

const CATEGORY_COLORS = [
  '#7DD3C0', // Pastel Mint
  '#FFB4A2', // Pastel Peach
  '#A7D8A0', // Pastel Green
  '#F4978E', // Pastel Coral
  '#A5B4FC', // Pastel Indigo
  '#FDE047', // Pastel Yellow
  '#67E8F9', // Pastel Cyan
  '#FDA4AF', // Pastel Rose
];

export const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await billApi.getBills();
      setBills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching dashboard bills:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Process Spending Over Time (sorted chronologically)
  const timeSeriesData = useMemo(() => {
    if (!bills.length) return [];

    const sorted = [...bills].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return sorted.map((b) => {
      const dateObj = new Date(b.createdAt);
      const formattedDate = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Unknown';

      return {
        date: formattedDate,
        fullDate: !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString() : 'N/A',
        amount: typeof b.total_amount === 'number' ? b.total_amount : parseFloat(b.total_amount) || 0,
        provider: b.provider_name || 'Unknown',
        type: b.bill_type || 'General',
      };
    });
  }, [bills]);

  // 2. Process Category Breakdown
  const categoryData = useMemo(() => {
    if (!bills.length) return [];

    const map = {};
    bills.forEach((b) => {
      const type = b.bill_type || 'Other';
      const amt = typeof b.total_amount === 'number' ? b.total_amount : parseFloat(b.total_amount) || 0;
      map[type] = (map[type] || 0) + amt;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    })).sort((a, b) => b.value - a.value);
  }, [bills]);

  // 3. Compute KPIs
  const stats = useMemo(() => {
    if (!bills.length) {
      return { totalSpend: 0, avgBill: 0, count: 0, highestBill: 0, topCategory: 'N/A' };
    }

    let total = 0;
    let max = 0;
    bills.forEach((b) => {
      const amt = typeof b.total_amount === 'number' ? b.total_amount : parseFloat(b.total_amount) || 0;
      total += amt;
      if (amt > max) max = amt;
    });

    const avg = total / bills.length;
    const topCat = categoryData.length > 0 ? categoryData[0].name : 'N/A';

    return {
      totalSpend: total,
      avgBill: avg,
      count: bills.length,
      highestBill: max,
      topCategory: topCat,
    };
  }, [bills, categoryData]);

  // Custom Chart Tooltips
  const CustomTimeTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-date">{data.fullDate || data.date}</p>
          <p className="tooltip-provider">{data.provider} ({data.type})</p>
          <p className="tooltip-amount">${data.amount.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = stats.totalSpend || 1;
      const percent = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-provider" style={{ color: data.payload.fill }}>
            {data.name}
          </p>
          <p className="tooltip-amount">${data.value.toFixed(2)}</p>
          <p className="tooltip-sub">{percent}% of total spend</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">Analytics & Trends</div>
          <h1 className="page-title">📊 Spending Trends</h1>
          <p className="page-subtitle">
            Track your utility expenses over time and discover category breakdowns.
          </p>
        </div>

        <Link to="/" className="btn-primary">
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
          <button className="btn-secondary" onClick={fetchDashboardData}>Retry</button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="dashboard-loading-grid">
          <div className="skeleton-kpi"></div>
          <div className="skeleton-kpi"></div>
          <div className="skeleton-kpi"></div>
          <div className="skeleton-kpi"></div>
        </div>
      )}

      {/* Empty State (0 bills) */}
      {!loading && !error && bills.length === 0 && (
        <div className="empty-state-card animate-fade-in">
          <div className="empty-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <h3>📭 No spending data available yet</h3>
          <p>Upload your bills to see monthly spend charts, category distributions, and automated cost insights.</p>
          <Link to="/" className="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Upload a Bill Now
          </Link>
        </div>
      )}

      {/* Main Dashboard Content */}
      {!loading && !error && bills.length > 0 && (
        <div className="dashboard-content animate-fade-in">
          {/* KPI Metrics Grid */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon-box teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="kpi-details">
                <span className="kpi-label">Total Spend</span>
                <h3 className="kpi-value">${stats.totalSpend.toFixed(2)}</h3>
                <span className="kpi-subtext">Across {stats.count} bills</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-box blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div className="kpi-details">
                <span className="kpi-label">Average Bill</span>
                <h3 className="kpi-value">${stats.avgBill.toFixed(2)}</h3>
                <span className="kpi-subtext">Per bill recorded</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-box emerald">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="kpi-details">
                <span className="kpi-label">Audited Bills</span>
                <h3 className="kpi-value">{stats.count}</h3>
                <span className="kpi-subtext">Saved in database</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-box amber">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.386l5.411-3.183c.827-.486 1.054-1.545.486-2.316l-9.581-9.58A2.25 2.25 0 0010.823 3H9.568z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              </div>
              <div className="kpi-details">
                <span className="kpi-label">Top Category</span>
                <h3 className="kpi-value" style={{ fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {stats.topCategory}
                </h3>
                <span className="kpi-subtext">Largest spend share</span>
              </div>
            </div>
          </div>

          {/* Few Bills Guidance Note */}
          {bills.length < 2 && (
            <div className="info-callout animate-fade-in">
              <span className="callout-icon">💡</span>
              <div className="callout-text">
                <strong>Tip:</strong> Upload a few more bills to unlock comprehensive historical spending trendlines and compare category shifts over time.
              </div>
            </div>
          )}

          {/* Charts Section */}
          <div className="dashboard-charts-grid">
            {/* Trend Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Spending Over Time</h3>
                  <p className="chart-subtitle">Historical bill totals ordered by date uploaded</p>
                </div>
              </div>

              <div className="chart-wrapper">
                {timeSeriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={270}>
                    <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmountTeal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7DD3C0" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#7DD3C0" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
                      <XAxis
                        dataKey="date"
                        stroke="var(--color-text-secondary)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--color-border)' }}
                      />
                      <YAxis
                        stroke="var(--color-text-secondary)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--color-border)' }}
                        tickFormatter={(v) => `$${v}`}
                      />
                      <Tooltip content={<CustomTimeTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#7DD3C0"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorAmountTeal)"
                        activeDot={{ r: 5, fill: '#7DD3C0', stroke: 'var(--color-bg-card)', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-empty-placeholder">No timeline data available</div>
                )}
              </div>
            </div>

            {/* Category Breakdown Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Breakdown by Category</h3>
                  <p className="chart-subtitle">Total expenditure grouped by bill type</p>
                </div>
              </div>

              <div className="chart-wrapper pie-wrapper">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={270}>
                    <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                            stroke="#FFFFFF"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => <span className="pie-legend-label">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-empty-placeholder">No category data available</div>
                )}
              </div>
            </div>
          </div>

          {/* Category Table Breakdown */}
          <div className="category-table-card">
            <h3 className="section-title">
              📄 Category Spend Summary
            </h3>

            <div className="category-list">
              {categoryData.map((cat, idx) => {
                const total = stats.totalSpend || 1;
                const percentage = ((cat.value / total) * 100).toFixed(1);
                const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

                return (
                  <div key={cat.name} className="category-row">
                    <div className="category-row-left">
                      <div className="category-indicator" style={{ backgroundColor: color }}></div>
                      <span className="category-name">{cat.name}</span>
                    </div>

                    <div className="category-progress-bar-container">
                      <div
                        className="category-progress-bar"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      ></div>
                    </div>

                    <div className="category-row-right">
                      <span className="category-amount">${cat.value.toFixed(2)}</span>
                      <span className="category-percentage">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
