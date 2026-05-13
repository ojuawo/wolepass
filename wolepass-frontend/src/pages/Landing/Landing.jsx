import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1 className={styles.headline}>The Offline-First Gate Management OS for Nigerian Estates</h1>
        <p className={styles.subHeadline}>
          Never lose your gate logs to bad network again. Secure your community with seamless offline syncing, WhatsApp notifications, and automated billing.
        </p>
        <Link to="/register" className={styles.ctaButton}>Start Free Trial</Link>
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Why choose WolePass?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>📡</div>
            <h3>Offline Sync</h3>
            <p>Our intelligent Dexie-powered tablets work flawlessly even when internet drops, automatically syncing when connections restore.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>💳</div>
            <h3>Paystack Billing</h3>
            <p>Automated subscription handling and enforcement utilizing deep Paystack integrations, handling direct debits gracefully.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>💬</div>
            <h3>WhatsApp Ready</h3>
            <p>Native Sendchamp hooks automatically route shareable gateway passes seamlessly to resident WhatsApp contacts effortlessly.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
