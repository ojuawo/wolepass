import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  // Step 2: Mock data for stats
  const mockStats = [
    { id: 1, title: 'Active Passes Today', value: '124', color: 'blue' },
    { id: 2, title: 'Total Residents', value: '1,420', color: 'green' },
    { id: 3, title: 'Blacklisted Visitors', value: '12', color: 'red' },
  ];

  // Step 2: Mock data for recent visits
  const mockVisits = [
    { id: 101, visitor: 'Babalola John', type: 'Delivery', time: '14:23 PM', status: 'Checked In' },
    { id: 102, visitor: 'Sarah Williams', type: 'Guest', time: '13:55 PM', status: 'Checked In' },
    { id: 103, visitor: 'Michael Adeyemi', type: 'Service', time: '12:40 PM', status: 'Checked In' },
    { id: 104, visitor: 'Chidi Okafor', type: 'Guest', time: '12:15 PM', status: 'Checked In' },
    { id: 105, visitor: 'Funmi Peters', type: 'Support', time: '11:30 AM', status: 'Checked In' },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.sectionTitle}>Estate Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Welcome back! Here's what's happening today.</p>
      </header>

      {/* Top Row: Stats Cards */}
      <section className={styles.statsRow}>
        {mockStats.map((stat) => (
          <div key={stat.id} className={styles.statCard}>
            <span className={styles.statTitle}>{stat.title}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </section>

      <div className={styles.mainGrid}>
        {/* Middle Section: Recent Activity Table */}
        <section className={styles.sectionBox}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.activityTable}>
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Entry Type</th>
                  <th>Time Check-In</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockVisits.map((visit) => (
                  <tr key={visit.id}>
                    <td style={{ fontWeight: 500 }}>{visit.visitor}</td>
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

        {/* Right Column: Quick Actions */}
        <section className={styles.sectionBox}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.quickActions}>
            <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
              Generate Dispatch Pass
            </button>
            <button className={styles.actionBtn}>
              Add Resident
            </button>
            <button className={styles.actionBtn}>
              View Gate Logs
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
