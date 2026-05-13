import React, { useState, useEffect, useCallback } from 'react';
import db from '../../services/db';
import { downloadPasses, uploadLogs } from '../../services/syncService';
import styles from './GateTerminal.module.css';

const GateTerminal = () => {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState(null);

  // Visitor list state
  const [expectedVisitors, setExpectedVisitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [otp, setOtp] = useState('');

  const loadExpectedVisitors = useCallback(async () => {
    try {
      const passes = await db.passes.where('status').equals('pending').toArray();
      setExpectedVisitors(passes);
    } catch (err) {
      console.error('Failed to load visitors:', err);
    }
  }, []);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setLoading(true);
      await uploadLogs();
      await downloadPasses();
      setLastSynced(new Date().toLocaleTimeString());
      await loadExpectedVisitors();
      setLoading(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      handleOnline();
    } else {
      loadExpectedVisitors();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadExpectedVisitors]);

  const handleManualSync = async () => {
    if (!navigator.onLine) return;
    setLoading(true);
    await uploadLogs();
    await downloadPasses();
    setLastSynced(new Date().toLocaleTimeString());
    await loadExpectedVisitors();
    setLoading(false);
  };

  const handleSelectVisitor = (visitor) => {
    setSelectedVisitor(visitor);
    setOtp('');
    setError(null);
  };

  const handleBackToList = () => {
    setSelectedVisitor(null);
    setOtp('');
    setError(null);
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6 || !selectedVisitor) return;

    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      // Verify the OTP matches the selected visitor
      if (otp !== selectedVisitor.otp_code) {
        setError('OTP does not match this visitor. Please try again.');
        setLoading(false);
        return;
      }

      const pass = await db.passes.get(otp);

      if (!pass) {
        setError('Invalid or Expired Pass. (Try syncing if newly generated).');
        setLoading(false);
        return;
      }

      if (pass.status !== 'pending') {
        setError('This pass has already been used.');
        setLoading(false);
        return;
      }

      await db.passes.update(otp, { status: 'checked_in' });
      await db.offline_logs.add({
        otp_code: otp,
        checked_in_at: new Date().toISOString(),
        synced: 0
      });

      setScanResult(pass);
      setOtp('');

      if (navigator.onLine) {
        uploadLogs();
      }
    } catch (err) {
      setError('A local database error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setError(null);
    setSelectedVisitor(null);
    setOtp('');
    loadExpectedVisitors();
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const filteredVisitors = expectedVisitors.filter((v) => {
    const name = (v.visitor_name || '').toLowerCase();
    const dest = (v.destination || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || dest.includes(q);
  });

  // ── Sync header (reused across views) ──
  const SyncHeader = ({ showControls }) => (
    <div className={showControls ? styles.syncStatusContainer : styles.syncHeader}>
      <div className={styles.statusIndicator}>
        <span className={isOnline ? styles.dotOnline : styles.dotOffline}></span>
        {isOnline ? 'Online' : 'Offline'}
      </div>
      {showControls && (
        <div className={styles.syncControls}>
          <button
            className={styles.syncBtn}
            onClick={handleManualSync}
            disabled={!isOnline || loading}
          >
            Manual Sync
          </button>
          {lastSynced && <span className={styles.lastSyncedTxt}>Last sync: {lastSynced}</span>}
        </div>
      )}
    </div>
  );

  // ── ACCESS GRANTED ──
  if (scanResult) {
    return (
      <div className={styles.container}>
        <SyncHeader />
        <div className={styles.successCard}>
          <h2>ACCESS GRANTED</h2>
          <p className={styles.infoText}>Visitor: {scanResult.visitor_name || 'Unknown'}</p>
          <p className={styles.infoText}>Destination: {scanResult.destination}</p>
          <button className={styles.resetButton} onClick={handleReset}>
            Scan Next Pass
          </button>
        </div>
      </div>
    );
  }

  // ── OTP CONFIRMATION (Step 2) ──
  if (selectedVisitor) {
    return (
      <div className={styles.container}>
        <SyncHeader />

        <div className={styles.confirmationPanel}>
          <button className={styles.backBtn} onClick={handleBackToList}>
            ← Back to List
          </button>

          <div className={styles.visitorDetailCard}>
            <h2 className={styles.detailName}>{selectedVisitor.visitor_name || 'Unknown Visitor'}</h2>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Destination</span>
              <span className={styles.detailValue}>{selectedVisitor.destination || '—'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Expected</span>
              <span className={styles.detailValue}>
                {selectedVisitor.expected_arrival
                  ? new Date(selectedVisitor.expected_arrival).toLocaleString()
                  : '—'}
              </span>
            </div>
          </div>

          {error && (
            <div className={styles.inlineError}>{error}</div>
          )}

          <form onSubmit={handleValidate} className={styles.otpForm}>
            <p className={styles.otpPrompt}>Enter the visitor's 6-digit OTP to confirm check-in:</p>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              className={styles.input}
              placeholder="ENTER OTP"
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
              {loading ? 'Validating...' : 'Confirm Check-In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── VISITOR LIST (Step 1) ──
  return (
    <div className={styles.container}>
      <SyncHeader showControls />

      <h1 className={styles.title}>Gate Terminal</h1>
      <p className={styles.subtitle}>Select an expected visitor to begin check-in</p>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by name or destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.visitorList}>
        {loading && expectedVisitors.length === 0 && (
          <p className={styles.emptyState}>Syncing visitors...</p>
        )}
        {!loading && filteredVisitors.length === 0 && (
          <p className={styles.emptyState}>
            {searchQuery ? 'No visitors match your search.' : 'No pending visitors. Try syncing.'}
          </p>
        )}
        {filteredVisitors.map((visitor) => (
          <button
            key={visitor.otp_code}
            className={styles.visitorCard}
            onClick={() => handleSelectVisitor(visitor)}
          >
            <div className={styles.visitorInfo}>
              <span className={styles.visitorName}>{visitor.visitor_name || 'Unknown Visitor'}</span>
              <span className={styles.visitorDest}>{visitor.destination || 'No destination'}</span>
            </div>
            <div className={styles.visitorMeta}>
              <span className={styles.visitorTime}>
                {visitor.expected_arrival
                  ? new Date(visitor.expected_arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '—'}
              </span>
              <span className={styles.chevron}>›</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GateTerminal;
