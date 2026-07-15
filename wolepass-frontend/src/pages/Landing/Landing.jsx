import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
  return (
    <div className={styles.container}>

      {/* ── HERO ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroBadge}>🇳🇬 Built for Nigerian Estates</div>
        <h1 className={styles.headline}>
          The Estate Platform That Collects Your Dues For You
        </h1>
        <p className={styles.subHeadline}>
          GateKeep is the only visitor management system that automatically suspends a resident's gate access when they owe dues — no confrontation, no calls, no drama.
        </p>
        <div className={styles.heroActions}>
          <Link to="/register" className={styles.ctaButton}>Get Started Free</Link>
          <a href="https://demo.gatekeep.com.ng" target="_blank" rel="noreferrer" className={styles.demoButton}>
            View Live Demo →
          </a>
        </div>
        <p className={styles.heroCaveat}>Plans from ₦25,000/month · No setup fee · Cancel anytime</p>
      </section>

      {/* ── ENFORCEMENT BANNER ── */}
      <section className={styles.enforcementSection}>
        <div className={styles.enforcementInner}>
          <h2 className={styles.enforcementTitle}>How Enforcement Works</h2>
          <p className={styles.enforcementSub}>Your most powerful debt collection tool isn't a phone call. It's their gate access.</p>
          <div className={styles.enforcementGrid}>
            <div className={styles.enforcementCard}>
              <span className={styles.enforcementIcon}>🔒</span>
              <strong>Dues unpaid?</strong>
              <p>Pass generation is blocked automatically. The resident sees a payment prompt — not a manager's message.</p>
            </div>
            <div className={styles.enforcementCard}>
              <span className={styles.enforcementIcon}>💳</span>
              <strong>Resident pays via Paystack</strong>
              <p>They settle directly in the app. Access is restored instantly. You never had to pick up the phone.</p>
            </div>
            <div className={styles.enforcementCard}>
              <span className={styles.enforcementIcon}>⚡</span>
              <strong>Coming soon: Utility Enforcement</strong>
              <p>Residents who owe dues won't be able to buy electricity tokens either — doubling the incentive to pay.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Everything You Need to Run a Modern Estate</h2>
        <p className={styles.featuresSub}>From the gate to the manager's dashboard, GateKeep covers every touchpoint.</p>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>🛡️</div>
            <h3>OTP Gate Verification</h3>
            <p>Guards verify visitors with a 6-digit OTP in under 15 seconds. No logbook. No phone calls. Full digital audit trail.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>📱</div>
            <h3>Resident Pass Generation</h3>
            <p>Residents generate passes for guests, dispatch riders, and service workers in seconds. Shareable via WhatsApp instantly.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>💰</div>
            <h3>Automated Billing Enforcement</h3>
            <p>Dues unpaid = passes suspended. No awkward conversations. The platform enforces your estate's policies automatically.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>📡</div>
            <h3>Offline-First Architecture</h3>
            <p>The guard's terminal works even without internet. All expected visitors are synced locally and updated when connectivity returns.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>📊</div>
            <h3>Admin Dashboard</h3>
            <p>Real-time overview of all estate activity — active visitors, compliance status, billing health, and traffic analytics in one place.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>📋</div>
            <h3>Full Audit Logs</h3>
            <p>Every check-in is timestamped and attributed to a guard. Searchable, filterable logs ready for security reviews and AGM meetings.</p>
          </div>
        </div>
      </section>

      {/* ── USER STORIES ── */}
      <section className={styles.storiesSection}>
        <div className={styles.storiesInner}>
          <h2 className={styles.featuresTitle}>Real Scenarios, Real Value</h2>
          <p className={styles.featuresSub}>GateKeep was designed around the everyday friction of estate living.</p>
          <div className={styles.storiesGrid}>
            <div className={styles.storyCard}>
              <span className={styles.storyEmoji}>📦</span>
              <h3>The Busy Professional</h3>
              <p>Tolu is in a client meeting when his food delivery arrives. He pre-authorized a Dispatch pass that morning. The rider shows the OTP, the guard verifies in 10 seconds, and Tolu gets a silent notification — no interruption.</p>
            </div>
            <div className={styles.storyCard}>
              <span className={styles.storyEmoji}>🎉</span>
              <h3>The Social Host</h3>
              <p>Sarah is hosting a housewarming for 10 friends. She generates OTPs and sends them via WhatsApp. Everyone breezes through the gate while she focuses on entertaining.</p>
            </div>
            <div className={styles.storyCard}>
              <span className={styles.storyEmoji}>💳</span>
              <h3>The Defaulting Resident</h3>
              <p>Mr. Bello hasn't paid dues in 3 months. He tries to generate a visitor pass — the app shows a Paystack prompt instead. He pays. Access restored instantly. No confrontation required.</p>
            </div>
            <div className={styles.storyCard}>
              <span className={styles.storyEmoji}>🚦</span>
              <h3>The Friday Gate Rush</h3>
              <p>Musa the guard has 5 cars queued at 6:30 PM. Each OTP verification takes under 15 seconds. Traffic flows. Logs are perfect. No logbook. No delays.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAIR USAGE ── */}
      <section className={styles.usageSection}>
        <div className={styles.usageGrid}>
          <div>
            <span className={styles.usageTag}>Security Policy</span>
            <h2 className={styles.usageTitle}>The 5-Visit Rule</h2>
            <p className={styles.usageText}>
              Standard residents are limited to <strong>5 visitor passes per week</strong>. This prevents unauthorized commercial activity (e.g., unregistered short-lets) and keeps gate traffic manageable for security personnel.
            </p>
            <p className={styles.usageText}>
              Hosting a larger event? Residents can request an <strong>Event Extension</strong> through the app — approved by the admin for weddings, parties, or family reunions.
            </p>
          </div>
          <div className={styles.usageStats}>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>5</span>
              <span className={styles.statLabel}>Passes per resident per week</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>&lt;15s</span>
              <span className={styles.statLabel}>Average gate verification time</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Digital audit trail</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section className={styles.roadmapSection}>
        <h2 className={styles.featuresTitle}>What's Coming Next</h2>
        <p className={styles.featuresSub}>We're building GateKeep into a full Estate OS. Here's our integration roadmap.</p>
        <div className={styles.roadmapGrid}>
          <div className={styles.roadmapCard}>
            <span className={styles.roadmapPhase}>Phase 1 — Next</span>
            <h3>📣 Community Noticeboard</h3>
            <p>Digital announcements and polls for residents. No more scattered WhatsApp groups — all estate communications in one place.</p>
          </div>
          <div className={styles.roadmapCard}>
            <span className={styles.roadmapPhase}>Phase 2</span>
            <h3>🛠️ Maintenance Ticketing</h3>
            <p>Residents report issues with a photo. Managers assign, track, and close tickets. Full resolution timeline on record.</p>
          </div>
          <div className={styles.roadmapCard}>
            <span className={styles.roadmapPhase}>Phase 3</span>
            <h3>🚧 Hardware Integration</h3>
            <p>Connect GateKeep to physical boom barriers and turnstiles. Successful OTP verification triggers the gate automatically.</p>
          </div>
          <div className={styles.roadmapCard}>
            <span className={styles.roadmapPhase}>Phase 4</span>
            <h3>⚡ Utility Vending</h3>
            <p>Buy electricity and water tokens directly in the app. Residents who owe dues can't purchase tokens until they clear their balance.</p>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className={styles.pricingSection}>
        <h2 className={styles.featuresTitle}>Simple, Transparent Pricing</h2>
        <p className={styles.featuresSub}>All plans include Utility Vending. Billing Enforcement unlocks from Standard.</p>
        <div className={styles.pricingGrid}>
          <div className={styles.priceCard}>
            <h3 className={styles.priceName}>Basic</h3>
            <div className={styles.priceAmount}>₦25,000<span>/mo</span></div>
            <p className={styles.priceTarget}>Up to 50 units</p>
            <ul className={styles.priceList}>
              <li>Visitor Pass & OTP Gate</li>
              <li>Utility Vending</li>
              <li>5 Passes / Week Per Resident</li>
              <li>Audit Logs (30-day)</li>
              <li>Standard Support</li>
            </ul>
            <Link to="/register" className={styles.priceButton}>Get Started</Link>
          </div>
          <div className={`${styles.priceCard} ${styles.priceCardPopular}`}>
            <div className={styles.popularBadge}>Most Popular</div>
            <h3 className={styles.priceName}>Standard</h3>
            <div className={styles.priceAmount}>₦75,000<span>/mo</span></div>
            <p className={styles.priceTarget}>Up to 200 units</p>
            <ul className={styles.priceList}>
              <li><strong>Billing Enforcement</strong></li>
              <li>Utility Vending</li>
              <li>Community Noticeboard</li>
              <li>Maintenance Ticketing</li>
              <li>Audit Logs (1 year)</li>
              <li>Priority Support</li>
            </ul>
            <Link to="/register" className={styles.priceButtonPopular}>Get Started</Link>
          </div>
          <div className={styles.priceCard}>
            <h3 className={styles.priceName}>Premium</h3>
            <div className={styles.priceAmount}>Custom</div>
            <p className={styles.priceTarget}>Unlimited units</p>
            <ul className={styles.priceList}>
              <li>Hardware Integration</li>
              <li>Utility Vending</li>
              <li>Advanced Analytics</li>
              <li>Dedicated Account Manager</li>
              <li>Whitelabel Options</li>
              <li>API Access</li>
            </ul>
            <a href="mailto:hello@gatekeep.com.ng" className={styles.priceButton}>Contact Us</a>
          </div>
        </div>
      </section>

      {/* ── LIMITED OFFER CTA ── */}
      <section className={styles.offerSection}>
        <div className={styles.offerInner}>
          <span className={styles.offerBadge}>⏳ Limited Time Offer</span>
          <h2 className={styles.offerTitle}>First 2 Estates Get 3 Months Free</h2>
          <p className={styles.offerText}>
            We're onboarding our first wave of pilot estates this month. Sign up now and get free setup plus 3 months on the Standard plan — absolutely no cost.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register" className={styles.ctaButton}>Claim Your Free Months</Link>
            <a href="https://demo.gatekeep.com.ng" target="_blank" rel="noreferrer" className={styles.demoButtonDark}>
              Try the Demo First →
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
