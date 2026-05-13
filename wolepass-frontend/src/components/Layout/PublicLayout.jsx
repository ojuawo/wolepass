import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import styles from './PublicLayout.module.css';

const PublicLayout = () => {
  return (
    <div className={styles.layoutContainer}>
      <header className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>WolePass</Link>
        </div>
        <nav className={styles.navLinks}>
          <Link to="/login" className={styles.loginBtn}>Login</Link>
          <Link to="/register" className={styles.registerBtn}>Get Started</Link>
        </nav>
      </header>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
