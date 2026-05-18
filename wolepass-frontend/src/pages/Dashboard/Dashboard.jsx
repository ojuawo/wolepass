import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [pendingResidents, setPendingResidents] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [actioning, setActioning] = useState(null);

  const role = user?.global_role || 'resident';
  const isAdmin = role === 'tenant_admin';
  const isGuard = role === 'guard';
  const isResident = role === 'resident';

  // 1. Fetch pending resident approvals for Estate Admins
  const fetchPendingResidents = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingPending(true);
    try {
      const res = await api.get('/admin/pending-residents');
      setPendingResidents(res.data.data);
    } catch (err) {
      console.error('Failed to load pending resident requests');
    } finally {
      setLoadingPending(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchPendingResidents();
  }, [fetchPendingResidents]);

  const handleApprove = async (residentId) => {
    setActioning(residentId);
    try {
      await api.post(`/admin/residents/${residentId}/approve`);
      setPendingResidents(prev => prev.filter(r => r.id !== residentId));
    } catch (err) {
      alert('Failed to approve resident.');
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (residentId) => {
    if (!confirm('Are you sure you want to decline this request?')) return;
    setActioning(residentId);
    try {
      await api.post(`/admin/residents/${residentId}/reject`);
      setPendingResidents(prev => prev.filter(r => r.id !== residentId));
    } catch (err) {
      alert('Failed to decline request.');
    } finally {
      setActioning(null);
    }
  };

  // Mock data tailored per role
  const getStats = () => {
    if (isAdmin) {
      return [
        { id: 1, title: 'Active Passes Today', value: '124', color: 'blue' },
        { id: 2, title: 'Total Residents', value: '142', color: 'green' },
        { id: 3, title: 'Pending Approvals', value: pendingResidents.length.toString(), color: 'amber' },
      ];
    }
    if (isGuard) {
      return [
        { id: 1, title: 'Checked-In Today', value: '47', color: 'blue' },
        { id: 2, title: 'Checked-Out Today', value: '38', color: 'green' },
        { id: 3, title: 'Active Onsite', value: '9', color: 'purple' },
      ];
    }
    // Resident stats
    return [
      { id: 1, title: 'My Active Passes', value: '2', color: 'blue' },
      { id: 2, title: 'Total Invites (Month)', value: '18', color: 'green' },
      { id: 3, title: 'Account Status', value: 'Approved', color: 'purple' },
    ];
  };

  const getRecentVisits = () => {
    if (isAdmin) {
      return [
        { id: 101, visitor: 'Babalola John', unit: 'Block A, Suite 101', type: 'Delivery', time: '14:23 PM', status: 'Checked In' },
        { id: 102, visitor: 'Sarah Williams', unit: 'Block B, Suite 202', type: 'Guest', time: '13:55 PM', status: 'Checked In' },
        { id: 103, visitor: 'Michael Adeyemi', unit: 'Block C, Penthouse', type: 'Service', time: '12:40 PM', status: 'Checked In' },
      ];
    }
    if (isGuard) {
      return [
        { id: 101, visitor: 'Babalola John', unit: 'Block A, Suite 101', type: 'Delivery', time: '14:23 PM', status: 'Checked In' },
        { id: 102, visitor: 'Sarah Williams', unit: 'Block B, Suite 202', type: 'Guest', time: '13:55 PM', status: 'Checked In' },
      ];
    }
    // Resident (strictly visits to their own unit)
    return [
      { id: 101, visitor: 'Babalola John', unit: 'My Unit', type: 'Delivery', time: '14:23 PM', status: 'Checked In' },
      { id: 104, visitor: 'Chidi Okafor', unit: 'My Unit', type: 'Guest', time: '12:15 PM', status: 'Checked In' },
    ];
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.sectionTitle}>
            {isAdmin ? 'Estate Admin Dashboard' : isGuard ? 'Gate Security Dashboard' : 'Resident Portal'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Welcome back, {user?.name}! Here is what is happening today.
          </p>
        </div>
      </header>

      {/* Top Row: Stats Cards */}
      <section className={styles.statsRow}>
        {getStats().map((stat) => (
          <div key={stat.id} className={`${styles.statCard} ${styles[`card_${stat.color}`]}`}>
            <span className={styles.statTitle}>{stat.title}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </section>

      <div className={styles.mainGrid}>
        {/* Left/Middle Column: Recent Activity */}
        <section className={styles.sectionBox}>
          <h2 className={styles.sectionTitle}>
            {isResident ? 'My Recent Visitors' : 'Recent Estate Activity'}
          </h2>
          <div className={styles.tableWrapper}>
            <table className={styles.activityTable}>
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  {!isResident && <th>Unit</th>}
                  <th>Entry Type</th>
                  <th>Time Check-In</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {getRecentVisits().map((visit) => (
                  <tr key={visit.id}>
                    <td style={{ fontWeight: 500 }}>{visit.visitor}</td>
                    {!isResident && <td>{visit.unit}</td>}
                    <td>{visit.type}</td>
                    <td>{visit.time}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles.statusCheckedIn}`}>
                        {visit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: Dynamic Quick Actions */}
        <section className={styles.sectionBox}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.quickActions}>
            {isResident && (
              <>
                <Link to="/generate" className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
                  🎫 Generate Visitor Pass
                </Link>
                <Link to="/tickets" className={styles.actionBtn}>
                  🛠️ Report Maintenance Issue
                </Link>
                <Link to="/noticeboard" className={styles.actionBtn}>
                  📣 View Estate Noticeboard
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/noticeboard" className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
                  📣 Post Announcement
                </Link>
                <Link to="/tickets" className={styles.actionBtn}>
                  🛠️ Assign Maintenance Tickets
                </Link>
                <Link to="/generate" className={styles.actionBtn}>
                  🎫 Generate Dispatch Pass
                </Link>
              </>
            )}

            {isGuard && (
              <>
                <Link to="/gate" className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
                  🔍 Verify Gate OTP Pass
                </Link>
                <Link to="/noticeboard" className={styles.actionBtn}>
                  📣 View Gate Bulletins
                </Link>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Admin pending approvals section */}
      {isAdmin && (
        <section className={styles.sectionBox} style={{ marginTop: '1rem' }}>
          <div className={styles.pendingHeader}>
            <h2 className={styles.sectionTitle}>🔒 Pending Resident Onboarding Requests</h2>
            <span className={styles.pendingCount}>{pendingResidents.length} requests</span>
          </div>

          {loadingPending ? (
            <div className={styles.emptyState}>Loading pending resident requests...</div>
          ) : pendingResidents.length === 0 ? (
            <div className={styles.emptyState}>
              <span style={{ fontSize: '2rem' }}>🎉</span>
              <p>All resident requests have been processed. Zero pending onboarding requests!</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.activityTable}>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Requested Unit</th>
                    <th style={{ textAlignment: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingResidents.map((resident) => (
                    <tr key={resident.id}>
                      <td style={{ fontWeight: 600 }}>{resident.name}</td>
                      <td>{resident.email}</td>
                      <td>{resident.phone || 'N/A'}</td>
                      <td>📍 {resident.unit?.unit_label}</td>
                      <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          className={styles.approveBtn}
                          onClick={() => handleApprove(resident.id)}
                          disabled={actioning !== null}
                        >
                          Approve
                        </button>
                        <button
                          className={styles.rejectBtn}
                          onClick={() => handleReject(resident.id)}
                          disabled={actioning !== null}
                        >
                          Decline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
