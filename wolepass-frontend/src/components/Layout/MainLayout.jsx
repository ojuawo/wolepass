import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>GateKeep</h2>
        </div>
        
        <nav className={styles.navMenu}>
          <NavLink 
            to="/dashboard" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <span className={styles.navIcon}>🏠</span>
            <span className={styles.navText}>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/noticeboard" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <span className={styles.navIcon}>📣</span>
            <span className={styles.navText}>Board</span>
          </NavLink>
          <NavLink 
            to="/tickets" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <span className={styles.navIcon}>🛠️</span>
            <span className={styles.navText}>Tickets</span>
          </NavLink>
          <NavLink 
            to="/generate" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <span className={styles.navIcon}>🎫</span>
            <span className={styles.navText}>Generate</span>
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <span className={styles.navIcon}>👤</span>
            <span className={styles.navText}>Profile</span>
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <span className={styles.navIcon}>⚙️</span>
            <span className={styles.navText}>Settings</span>
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.email || user?.name || 'Admin User'}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
