import React, { useState } from 'react';
import api from '../../services/api';
import styles from './GateTerminal.module.css';

const GateTerminal = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;

    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const response = await api.post('/gate/validate', { otp_code: otp });
      setScanResult(response.data);
      setOtp('');
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Verification failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setError(null);
    setOtp('');
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Allow only numbers
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  if (scanResult) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <h2>ACCESS GRANTED</h2>
          <p className={styles.infoText}>Visitor: {scanResult.visitor_name || scanResult.name || 'Unknown'}</p>
          <p className={styles.infoText}>Destination: {scanResult.destination}</p>
          <button className={styles.resetButton} onClick={handleReset}>
            Scan Next Pass
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>ACCESS DENIED</h2>
          <p className={styles.infoText}>{error}</p>
          <button className={styles.resetButton} onClick={handleReset}>
            Scan Next Pass
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gate Terminal</h1>
      <form onSubmit={handleValidate} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', alignItems: 'center' }}>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          className={styles.input}
          placeholder="ENTER CODE"
          value={otp}
          onChange={handleOtpChange}
          disabled={loading}
          autoComplete="off"
          autoFocus
          maxLength={6}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={loading || otp.length < 6}
        >
          {loading ? 'Validating...' : 'Validate Pass'}
        </button>
      </form>
    </div>
  );
};

export default GateTerminal;
