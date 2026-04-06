import React, { useState } from 'react';
import styles from './Settings.module.css';

const Settings = () => {
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    highContrastMode: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSecurityChange = (e) => {
    setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  };

  const handlePreferenceToggle = () => {
    setPreferences(prev => ({
      ...prev,
      highContrastMode: !prev.highContrastMode
    }));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match!' });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your account security and application preferences</p>
      </header>

      {status.message && (
        <div className={`${styles.alert} ${styles[status.type]}`}>
          {status.message}
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Security</h2>
        <div className={styles.card}>
          <form onSubmit={handlePasswordUpdate}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className={styles.input}
                value={securityData.currentPassword}
                onChange={handleSecurityChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className={styles.input}
                  value={securityData.newPassword}
                  onChange={handleSecurityChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={styles.input}
                  value={securityData.confirmPassword}
                  onChange={handleSecurityChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isLoading || !securityData.currentPassword || !securityData.newPassword}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Preferences</h2>
        <div className={styles.card}>
          <div className={styles.preferenceItem}>
            <div className={styles.preferenceInfo}>
              <h3 className={styles.preferenceName}>Enable High-Contrast Mode for Gate Tablet</h3>
              <p className={styles.preferenceDescription}>
                Optimizes the Gate Terminal display for better visibility in bright sunlight or for users with visual impairments.
              </p>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={preferences.highContrastMode}
                onChange={handlePreferenceToggle}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
