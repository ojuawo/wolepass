import React, { useState } from 'react';
import { registerEstate } from '../../services/api';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    estate_name: '',
    admin_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await registerEstate(formData);
      
      const accessData = response.data.data || response.data;
      const token = accessData.token || accessData.access_token;
      
      if (token) {
        localStorage.setItem('gatekeep_token', token);
        localStorage.setItem('gatekeep_user', JSON.stringify(accessData.user || { email: formData.email }));
      }
      
      // Directly redirect new instances strictly outbound out of application frame securing Paystack integrations
      const redirectUrl = accessData.authorization_url || response.data.authorization_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        setError("Missing Paystack verification URL in registration response.");
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Create Your Estate</h1>
        <p className={styles.subtitle}>Get started with GateKeep in 2 minutes.</p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Estate Name</label>
            <input name="estate_name" type="text" className={styles.input} value={formData.estate_name} onChange={handleInputChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Admin Full Name</label>
            <input name="admin_name" type="text" className={styles.input} value={formData.admin_name} onChange={handleInputChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Admin Email</label>
            <input name="email" type="email" className={styles.input} value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Admin Phone Number</label>
            <input name="phone" type="tel" className={styles.input} value={formData.phone} onChange={handleInputChange} required />
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input name="password" type="password" className={styles.input} value={formData.password} onChange={handleInputChange} required minLength={8} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Confirm Password</label>
              <input name="password_confirmation" type="password" className={styles.input} value={formData.password_confirmation} onChange={handleInputChange} required minLength={8} />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : 'Register & Pay Online'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
