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
  const [pendingVisitors, setPendingVisitors] = useState([]);
  const [checkedInVisitors, setCheckedInVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState('expected'); // 'expected' | 'checked_in'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [otp, setOtp] = useState('');

  const loadVisitors = useCallback(async () => {
    try {
      const pending = await db.passes.where('status').equals('pending').toArray();
      const checkedIn = await db.passes.where('status').equals('checked_in').toArray();
      setPendingVisitors(pending);
      setCheckedInVisitors(checkedIn);
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
      await loadVisitors();
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
      loadVisitors();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadVisitors]);

  const handleManualSync = async () => {
    if (!navigator.onLine) return;
    setLoading(true);
    await uploadLogs();
    await downloadPasses();
    setLastSynced(new Date().toLocaleTimeString());
    await loadVisitors();
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

      setScanResult({ ...pass, action: 'checked_in' });
      setOtp('');
      setSelectedVisitor(null);

      if (navigator.onLine) {
        uploadLogs();
      }
    } catch (err) {
      setError('A local database error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (e) => {
    e.preventDefault();
    if (!selectedVisitor) return;

    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      await db.passes.update(selectedVisitor.otp_code, { status: 'checked_out' });
      await db.offline_logs.add({
        otp_code: selectedVisitor.otp_code,
        checked_out_at: new Date().toISOString(),
        synced: 0
      });

      setScanResult({ ...selectedVisitor, action: 'checked_out' });
      setSelectedVisitor(null);

      if (navigator.onLine) {
        uploadLogs();
      }
    } catch (err) {
      setError('A local database error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setError(null);
    setSelectedVisitor(null);
    setOtp('');
    loadVisitors();
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const activeVisitors = activeTab === 'expected' ? pendingVisitors : checkedInVisitors;

  const filteredVisitors = activeVisitors.filter((v) => {
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

  // ── ACCESS GRANTED / CHECK-OUT SUCCESS ──
  if (scanResult) {
    const isCheckout = scanResult.action === 'checked_out';
    return (
      <div className={styles.container}>
        <SyncHeader />
        <div className={isCheckout ? styles.checkoutSuccessCard : styles.successCard}>
          <h2>{isCheckout ? 'CHECK-OUT CONFIRMED' : 'ACCESS GRANTED'}</h2>
          <p className={styles.infoText}>Visitor: {scanResult.visitor_name || 'Unknown'}</p>
          <p className={styles.infoText}>Destination: {scanResult.destination}</p>
          <p className={styles.infoText}>
            Status: {isCheckout ? 'Checked Out Successfully' : 'Checked In Successfully'}
          </p>
          <button className={styles.resetButton} onClick={handleReset}>
            Back to Terminal
          </button>
        </div>
      </div>
    );
  }

  // ── CONFIRMATION PANEL (Step 2) ──
  if (selectedVisitor) {
    const isCheckoutFlow = selectedVisitor.status === 'checked_in';
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
              <span className={styles.detailLabel}>Expected Arrival</span>
              <span className={styles.detailValue}>
                {selectedVisitor.expected_arrival
                  ? new Date(selectedVisitor.expected_arrival).toLocaleString()
                  : '—'}
              </span>
            </div>
            {isCheckoutFlow && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Current Status</span>
                <span className={styles.detailValue} style={{ color: '#10b981', fontWeight: 'bold' }}>
                  Checked In
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className={styles.inlineError}>{error}</div>
          )}

          {isCheckoutFlow ? (
            <form onSubmit={handleCheckOut} className={styles.otpForm}>
              <p className={styles.otpPrompt}>Click the button below to confirm the visitor is leaving the estate:</p>
              <button
                type="submit"
                className={styles.checkoutBtn}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Check-Out'}
              </button>
            </form>
          ) : (
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
          )}
        </div>
      </div>
    );
  }

  // ── VISITOR LIST (Step 1) ──
  return (
    <div className={styles.container}>
      <SyncHeader showControls />

      <h1 className={styles.title}>Gate Terminal</h1>
      <p className={styles.subtitle}>Select a guest to manage check-in or check-out</p>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'expected' ? styles.tabBtnActive : ''}`}
          onClick={() => {
            setActiveTab('expected');
            setSearchQuery('');
          }}
        >
          Expected Guests
          <span className={styles.tabBadge}>{pendingVisitors.length}</span>
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'checked_in' ? styles.tabBtnActive : ''}`}
          onClick={() => {
            setActiveTab('checked_in');
            setSearchQuery('');
          }}
        >
          Checked-In Guests
          <span className={styles.tabBadge}>{checkedInVisitors.length}</span>
        </button>
      </div>

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
        {loading && activeVisitors.length === 0 && (
          <p className={styles.emptyState}>Syncing visitors...</p>
        )}
        {!loading && filteredVisitors.length === 0 && (
          <p className={styles.emptyState}>
            {searchQuery
              ? 'No visitors match your search.'
              : activeTab === 'expected'
              ? 'No pending expected guests.'
              : 'No currently checked-in guests.'}
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
              <span className={styles.visitorTime} style={{ color: activeTab === 'expected' ? '#60a5fa' : '#fbbf24' }}>
                {activeTab === 'expected' ? 'Expected' : 'Checked In'}
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
