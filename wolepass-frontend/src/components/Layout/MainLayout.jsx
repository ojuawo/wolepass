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
          <h2>WolePass</h2>
        </div>
        
        <nav className={styles.navMenu}>
          <NavLink 
            to="/dashboard" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            🏠 Dashboard
          </NavLink>
          <NavLink 
            to="/noticeboard" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            📣 Community Board
          </NavLink>
          <NavLink 
            to="/tickets" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            🛠️ Maintenance Hub
          </NavLink>
          <NavLink 
            to="/generate" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            🎫 Generate Pass
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            👤 Profile
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            ⚙️ Settings
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
