import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../context/useTheme';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header-nav">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" aria-label="UVLens Home">
          <div className="nav-logo-icon">
            <span>🔍</span>
          </div>
          <div className="nav-brand-text">
            <span className="nav-brand-title">UVLens</span>
            <span className="nav-brand-badge">AI</span>
          </div>
        </Link>

        {/* Desktop Navigation & Theme Toggle */}
        <div className="nav-right-group">
          <nav className="nav-links desktop-nav" aria-label="Primary Navigation">
            <NavLink
              to="/history"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Bill History</span>
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              <span>Trends Dashboard</span>
            </NavLink>
          </nav>

          {/* Dark / Light Mode Toggle Button */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="theme-toggle-emoji">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <NavLink
          to="/history"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mobile-nav-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="mobile-nav-label">History</span>
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mobile-nav-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <span className="mobile-nav-label">Trends</span>
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
