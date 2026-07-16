import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import styles from './PublicLayout.module.css';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (e, targetId) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        const offset = 80; // height of the sticky navbar
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      setIsMenuOpen(false);
    }
  };

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
            <span className={styles.logoBadge}>🛡️</span>
            <span className={styles.logoText}>Gatekeep<span className={styles.logoDot}>.</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <a href="/#features" onClick={(e) => handleNavClick(e, 'features')} className={styles.navLink}>Features</a>
          <a href="/#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')} className={styles.navLink}>How It Works</a>
          <a href="/#security" onClick={(e) => handleNavClick(e, 'security')} className={styles.navLink}>Security</a>
          <a href="/#pilot-form" onClick={(e) => handleNavClick(e, 'pilot-form')} className={styles.pilotCtaBtn}>
            Request a 30-Day Free Pilot
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Mobile Navigation Dropdown */}
        <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavActive : ''}`}>
          <a href="/#features" onClick={(e) => handleNavClick(e, 'features')} className={styles.mobileNavLink}>Features</a>
          <a href="/#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')} className={styles.mobileNavLink}>How It Works</a>
          <a href="/#security" onClick={(e) => handleNavClick(e, 'security')} className={styles.mobileNavLink}>Security</a>
          <a href="/#pilot-form" onClick={(e) => handleNavClick(e, 'pilot-form')} className={styles.mobilePilotCtaBtn}>
            Request a 30-Day Free Pilot
          </a>
        </nav>
      </header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
