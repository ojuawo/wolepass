import React, { useState } from 'react';
import api, { initializeBilling } from '../../services/api';
import styles from './GeneratePass.module.css';

const GeneratePass = () => {
  const [visitType, setVisitType] = useState('personal');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [expectedArrival, setExpectedArrival] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedPass, setGeneratedPass] = useState(null);
  const [isSuspended, setIsSuspended] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      visit_type: visitType,
      expected_arrival: expectedArrival,
    };

    if (phoneNumber.trim() !== '') {
      payload.phone_number = phoneNumber.trim();
    }
    if (fullName.trim() !== '') {
      payload.full_name = fullName.trim();
    }

    try {
      const response = await api.post('/passes', payload);
      setGeneratedPass(response.data);
    } catch (err) {
      if (err.response && err.response.status === 402) {
        setIsSuspended(true);
        setLoading(false);
        return;
      }
      setError(
        err.response?.data?.message || err.message || 'Pass generation failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedPass(null);
    setPhoneNumber('');
    setFullName('');
    setError(null);
  };

  const handlePaymentRedirect = async () => {
    setLoading(true);
    try {
      const response = await initializeBilling();
      window.location.href = response.data.authorization_url;
    } catch (err) {
      setError('Unable to initialize payment. Please try again later.');
      setLoading(false);
    }
  };

  if (isSuspended) {
    return (
      <div className={styles.container}>
        <div className={styles.suspendedCard}>
          <h2 className={styles.suspendedTitle}>Subscription Suspended</h2>
          <p className={styles.suspendedText}>
            You cannot generate passes until the estate's subscription is renewed.
          </p>
          <button 
            className={styles.payButton} 
            onClick={handlePaymentRedirect}
            disabled={loading}
          >
            {loading ? 'Initializing...' : 'Pay with Paystack to Unlock'}
          </button>
        </div>
      </div>
    );
  }

  if (generatedPass) {
    console.log(generatedPass)
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <h2 className={styles.successTitle}>Pass Generated Successfully!</h2>
          <div className={styles.otpBox}>
            <span className={styles.otpLabel}>OTP CODE</span>
            <span className={styles.otpText}>{generatedPass.visit.otp_code || generatedPass.visit?.otp_code}</span>
          </div>
          <div className={styles.shareBox}>
            <p className={styles.shareText}>{generatedPass.shareable_text}</p>
          </div>
          <button className={styles.resetButton} onClick={handleReset}>
            Generate Another Pass
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Generate Pass</h1>
      {error && <div className={styles.errorBanner}>{error}</div>}

      <form className={styles.formContainer} onSubmit={handleGenerate}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Visit Type</label>
          <select
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            className={styles.inputElement}
            disabled={loading}
          >
            <option value="personal">Personal</option>
            <option value="dispatch">Dispatch / Delivery</option>
            <option value="service">Service / Artisan</option>
            <option value="meeting">Meeting</option>
            <option value="interview">Interview</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={styles.inputElement}
            placeholder="+234..."
            disabled={loading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={styles.inputElement}
            placeholder="John Doe"
            disabled={loading}
          />
          <span className={styles.helperText}>Leave blank for quick dispatch passes.</span>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Expected Arrival</label>
          <input
            type="datetime-local"
            value={expectedArrival}
            onChange={(e) => setExpectedArrival(e.target.value)}
            className={styles.inputElement}
            disabled={loading}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Generating...' : 'Generate New Pass'}
        </button>
      </form>
    </div>
  );
};

export default GeneratePass;
