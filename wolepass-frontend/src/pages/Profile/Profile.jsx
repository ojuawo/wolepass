import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
  const { user } = useAuth();
  
  // Mock data if user context is empty/limited
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+234 800 000 0000',
    role: user?.role || 'Tenant Admin'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handlePhoneChange = (e) => {
    setProfileData({ ...profileData, phone: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: 'success', content: 'Profile updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', content: '' }), 3000);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Account Profile</h1>
        <p className={styles.subtitle}>Manage your personal information and account role</p>
      </header>

      {message.content && (
        <div className={`${styles.alert} ${styles[message.type]}`}>
          {message.content}
        </div>
      )}

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={styles.inputReadOnly}
                value={profileData.name}
                readOnly
              />
              <span className={styles.hint}>Read-only field</span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={styles.inputReadOnly}
                value={profileData.email}
                readOnly
              />
              <span className={styles.hint}>Read-only field</span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                className={styles.input}
                value={profileData.phone}
                onChange={handlePhoneChange}
                placeholder="+234 ..."
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Account Role</label>
              <input
                type="text"
                className={styles.inputReadOnly}
                value={profileData.role}
                readOnly
              />
              <span className={styles.badge}>{profileData.role}</span>
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
