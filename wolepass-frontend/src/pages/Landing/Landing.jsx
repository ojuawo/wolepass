import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
  // State for Dual-Benefit switcher
  const [activeTab, setActiveTab] = useState('managers');

  // State for the Sentry Flow Demo Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(1);

  // States for Lead Capture Form
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    estateName: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');

    // Basic Validation
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.estateName.trim()) {
      setSubmitError('All fields are required.');
      return;
    }

    // Phone validation for Nigerian context (+234 or 070/080/090/081 etc.)
    const cleanPhone = formData.phone.replace(/[\s-()]/g, '');
    const phoneRegex = /^(?:\+?234|0)[789]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setSubmitError('Please enter a valid Nigerian phone number (e.g. 08031234567).');
      return;
    }

    setSubmitting(true);
    
    // Simulate API registration submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
      // Reset form
      setFormData({ fullName: '', phone: '', estateName: '' });
    }, 1200);
  };

  const scrollToPilotForm = (e) => {
    e.preventDefault();
    const el = document.getElementById('pilot-form');
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.container}>

      {/* ── 1. HERO SECTION ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroLayout}>
          <div className={styles.heroTextContent}>
            <div className={styles.heroBadge}>
              <span className={styles.badgePulse}></span>
              Enterprise Grade Perimeter Security
            </div>
            <h1 className={styles.headline}>
              Modern Access Control for Secure Communities & Offices.
            </h1>
            <p className={styles.subHeadline}>
              Ditch the open paper logbooks. Gatekeep provides frictionless visitor pre-registration, real-time gate monitoring, and airtight, encrypted audit trails for estates and corporate facilities.
            </p>
            <div className={styles.heroActions}>
              <a href="#pilot-form" onClick={scrollToPilotForm} className={styles.ctaButton}>
                Request a 30-Day Free Pilot
              </a>
              <button onClick={() => { setIsModalOpen(true); setDemoStep(1); }} className={styles.demoButton}>
                <span className={styles.playIcon}>▶</span> Watch How It Works
              </button>
            </div>
            <p className={styles.heroCaveat}>
              🛡️ Zero-compromise encryption · High-availability offline support
            </p>
          </div>

          <div className={styles.heroVisualContent}>
            <div className={styles.mockupContainer}>
              {/* Resident QR Mobile Screen Mockup */}
              <div className={styles.phoneMockup}>
                <div className={styles.phoneHeader}>
                  <div className={styles.phoneSpeaker}></div>
                </div>
                <div className={styles.phoneScreen}>
                  <div className={styles.phoneAppHeader}>
                    <span>Gatekeep Pass</span>
                  </div>
                  <div className={styles.qrContainer}>
                    <svg viewBox="0 0 100 100" className={styles.qrSvg}>
                      {/* Stylized QR Code SVG */}
                      <path d="M5,5 h30 v30 h-30 z M15,15 h10 v10 h-10 z" fill="#ffffff" />
                      <path d="M65,5 h30 v30 h-30 z M75,15 h10 v10 h-10 z" fill="#ffffff" />
                      <path d="M5,65 h30 v30 h-30 z M15,75 h10 v10 h-10 z" fill="#ffffff" />
                      <path d="M45,10 h10 v10 h-10 z M45,30 h10 v10 h-10 z M55,45 h10 v10 h-10 z" fill="#000000" />
                      <path d="M10,45 h10 v10 h-10 z M30,45 h10 v10 h-10 z M40,55 h10 v10 h-10 z" fill="#ffffff" />
                      <path d="M70,45 h20 v10 h-20 z M80,60 h10 v10 h-10 z M65,80 h15 v15 h-15 z" fill="#ffffff" />
                      <path d="M45,75 h15 v10 h-15 z M50,90 h10 v5 h-10 z" fill="#000000" />
                    </svg>
                    <div className={styles.qrOverlay}>
                      <span className={styles.qrShield}>🛡️</span>
                    </div>
                  </div>
                  <div className={styles.passDetails}>
                    <h3>Visitor: Tolu Adebayo</h3>
                    <p className={styles.passType}>Residential Access Pass</p>
                    <div className={styles.passTime}>Expires Today, 6:00 PM</div>
                  </div>
                </div>
              </div>

              {/* Guard Sentry Dashboard Mockup */}
              <div className={styles.dashboardMockup}>
                <div className={styles.dashboardHeader}>
                  <div className={styles.dots}>
                    <span></span><span></span><span></span>
                  </div>
                  <div className={styles.dashboardTitle}>Gatekeep Sentry Terminal</div>
                  <div className={styles.terminalStatus}>
                    <span className={styles.statusDot}></span> Live
                  </div>
                </div>
                <div className={styles.dashboardContent}>
                  <div className={styles.statsBar}>
                    <div className={styles.miniStat}>
                      <span>Expected Today</span>
                      <strong>84</strong>
                    </div>
                    <div className={styles.miniStat}>
                      <span>Checked In</span>
                      <strong className={styles.activeColor}>52</strong>
                    </div>
                  </div>
                  <div className={styles.activityList}>
                    <div className={styles.activityTitle}>Live Access Logs</div>
                    
                    <div className={styles.logRow}>
                      <span className={styles.logTime}>13:42</span>
                      <div className={styles.logDetail}>
                        <strong>Tolu Adebayo</strong>
                        <span>Invited by Apt 4B</span>
                      </div>
                      <span className={styles.statusBadgeOk}>VERIFIED</span>
                    </div>
                    
                    <div className={styles.logRow}>
                      <span className={styles.logTime}>13:38</span>
                      <div className={styles.logDetail}>
                        <strong>Musa Ibrahim (Dispatch)</strong>
                        <span>Invited by Office 12</span>
                      </div>
                      <span className={styles.statusBadgeOk}>VERIFIED</span>
                    </div>

                    <div className={styles.logRow}>
                      <span className={styles.logTime}>13:15</span>
                      <div className={styles.logDetail}>
                        <strong>Chinedu Okafor</strong>
                        <span>Invited by Apt 9A</span>
                      </div>
                      <span className={styles.statusBadgeDenied}>SUSPENDED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST ANCHOR / CREDIBILITY BAR ── */}
      <section className={styles.trustSection}>
        <div className={styles.trustContainer}>
          <div className={styles.trustGrid}>
            <div className={styles.trustText}>
              <span className={styles.secureSeal}>🛡️</span>
              <p>Engineered to meet the standards of high-security institutional hubs, corporate headquarters, and premium gated estates.</p>
            </div>
            <div className={styles.trustBadges}>
              <div className={styles.badgeItem}>
                <span className={styles.badgeIcon}>🔒</span>
                <span>Military-Grade AES 256 Encryption</span>
              </div>
              <div className={styles.badgeItem}>
                <span className={styles.badgeIcon}>📜</span>
                <span>100% Tamperproof Audit Logs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. DUAL-BENEFIT INTERACTIVE SECTION (Core Funnel) ── */}
      <section id="features" className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Purpose-Built Access Architecture</span>
          <h2 className={styles.sectionTitle}>One Platform. Two Specialized Solutions.</h2>
          <p className={styles.sectionDesc}>
            Gatekeep addresses the unique pain points of security administrators enforcing strict protocols, while offering frictionless convenience for hosts and residents.
          </p>
        </div>

        {/* Tab Controls */}
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'managers' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('managers')}
          >
            <span className={styles.tabIcon}>🏢</span>
            <div className={styles.tabTextWrapper}>
              <h3>For Estate Managers & Security Executives</h3>
              <p>Administrative control, accountability & audits</p>
            </div>
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'residents' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('residents')}
          >
            <span className={styles.tabIcon}>🏠</span>
            <div className={styles.tabTextWrapper}>
              <h3>For Residents & Tenants</h3>
              <p>Pre-registration, QR codes & guest entry</p>
            </div>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className={styles.panelContainer}>
          {activeTab === 'managers' && (
            <div className={`${styles.panel} ${styles.fadeIn}`}>
              <div className={styles.panelGrid}>
                <div className={styles.panelText}>
                  <h3>Administrative Control & Airtight Accountability</h3>
                  <p className={styles.panelIntro}>
                    Ensure security protocols are followed at the perimeter. Eliminate pen-and-paper vulnerabilities and optimize sentry operations.
                  </p>
                  
                  <div className={styles.benefitList}>
                    <div className={styles.benefitItem}>
                      <div className={styles.benefitIconWrapper}>✓</div>
                      <div>
                        <h4>Unalterable Digital Audit Trails</h4>
                        <p>Instantly search visitor histories by name, phone, or date. No missing pages, no unreadable handwriting, and zero risk of physical logbook destruction.</p>
                      </div>
                    </div>
                    <div className={styles.benefitItem}>
                      <div className={styles.benefitIconWrapper}>✓</div>
                      <div>
                        <h4>Sentry Accountability</h4>
                        <p>Monitor gate operations in real-time. Know exactly which guard checked in which guest, track sentry shifts, and measure check-in speeds.</p>
                      </div>
                    </div>
                    <div className={styles.benefitItem}>
                      <div className={styles.benefitIconWrapper}>✓</div>
                      <div>
                        <h4>Confidential Data Architecture</h4>
                        <p>Visitor logs are encrypted and hidden from plain view on the gate terminal. Sentry staff can only see active credentials, keeping sensitive guest lists private.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.panelVisual}>
                  <div className={styles.logAuditMock}>
                    <div className={styles.auditMockHeader}>
                      <span>Visitor Audit Logs</span>
                      <span className={styles.searchBarMock}>🔍 Search logs...</span>
                    </div>
                    <div className={styles.auditTableMock}>
                      <div className={styles.auditRowHeader}>
                        <span>Date/Time</span>
                        <span>Visitor</span>
                        <span>Checked In By</span>
                        <span>Host</span>
                      </div>
                      <div className={styles.auditRow}>
                        <span>16 Jul, 01:22</span>
                        <strong>Captain A. Bello</strong>
                        <span>Sgt. Gabriel</span>
                        <span>HQ Finance (A.1)</span>
                      </div>
                      <div className={styles.auditRow}>
                        <span>16 Jul, 00:54</span>
                        <strong>Engr. Toyin Cole</strong>
                        <span>Cpl. D. Musa</span>
                        <span>Bungalow 18</span>
                      </div>
                      <div className={styles.auditRow}>
                        <span>15 Jul, 23:45</span>
                        <strong>Damilola Coker</strong>
                        <span>Cpl. D. Musa</span>
                        <span>Villa 4</span>
                      </div>
                    </div>
                    <div className={styles.auditSecuredBadge}>
                      <span className={styles.lockPulse}></span> Encrypted with SHA-256
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'residents' && (
            <div className={`${styles.panel} ${styles.fadeIn}`}>
              <div className={styles.panelGrid}>
                <div className={styles.panelText}>
                  <h3>A Smooth, Frictionless Entrance for Your Guests</h3>
                  <p className={styles.panelIntro}>
                    Empower residents to manage their guest access codes. Say goodbye to intercom calls from the gate and long queues at the perimeter.
                  </p>
                  
                  <div className={styles.benefitList}>
                    <div className={styles.benefitItem}>
                      <div className={styles.benefitIconWrapper}>✓</div>
                      <div>
                        <h4>Instant QR & SMS Invites</h4>
                        <p>Pre-authorize guests via WhatsApp or SMS in two clicks. The system issues a secure, one-time-use pass code directly to the visitor's phone.</p>
                      </div>
                    </div>
                    <div className={styles.benefitItem}>
                      <div className={styles.benefitIconWrapper}>✓</div>
                      <div>
                        <h4>Zero Gate Bottlenecks</h4>
                        <p>Guests display their QR code to the guard. The sentry scans and verifies in 3 seconds. Traffic flows smoothly and visitors enter without friction.</p>
                      </div>
                    </div>
                    <div className={styles.benefitItem}>
                      <div className={styles.benefitIconWrapper}>✓</div>
                      <div>
                        <h4>Domestic Staff Tracking</h4>
                        <p>Monitor check-in/check-out timestamps for delivery drivers, plumbers, technicians, and household staff. Get instant mobile notifications when they enter or leave.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.panelVisual}>
                  <div className={styles.residentsAppMock}>
                    <div className={styles.residentsAppHeader}>
                      <span>Invite Guest</span>
                    </div>
                    <div className={styles.appFormMock}>
                      <div className={styles.appInputGroup}>
                        <label>Visitor Name</label>
                        <div className={styles.appInputMock}>Kolawole Johnson</div>
                      </div>
                      <div className={styles.appInputGroup}>
                        <label>Category</label>
                        <div className={styles.appInputMock}>Household Worker</div>
                      </div>
                      <div className={styles.appButtonMock}>
                        Generate Access Pass
                      </div>
                      <div className={styles.shareOptionMock}>
                        <span>Share Invite via:</span>
                        <div className={styles.shareButtons}>
                          <span className={styles.waBadge}>WhatsApp</span>
                          <span className={styles.smsBadge}>SMS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. "HOW IT WORKS" SECTION ── */}
      <section id="how-it-works" className={styles.howItWorksSection}>
        <div className={styles.containerInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Seamless Security Loop</span>
            <h2 className={styles.sectionTitle}>The 3-Step Verification Protocol</h2>
            <p className={styles.sectionDesc}>
              A secure, straightforward pipeline linking hosts, sentries, and administrators in a single source of truth.
            </p>
          </div>

          <div className={styles.timelineGrid}>
            {/* Step 1 */}
            <div className={styles.timelineStep}>
              <div className={styles.stepNumberContainer}>
                <span className={styles.stepNumber}>01</span>
                <span className={styles.stepConnector}></span>
              </div>
              <div className={styles.stepContent}>
                <h3>Pre-Authorize</h3>
                <p>The host officer or resident creates a secure access pass via the web platform, setting expiry times and access parameters. Invitation is sent to the visitor.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={styles.timelineStep}>
              <div className={styles.stepNumberContainer}>
                <span className={styles.stepNumber}>02</span>
                <span className={styles.stepConnector}></span>
              </div>
              <div className={styles.stepContent}>
                <h3>Verify</h3>
                <p>The sentry at the gate uses a smartphone, tablet, or laptop to instantly scan the visitor's QR code or type in their unique passcode to check authorization status.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={styles.timelineStep}>
              <div className={styles.stepNumberContainer}>
                <span className={styles.stepNumber}>03</span>
              </div>
              <div className={styles.stepContent}>
                <h3>Secure</h3>
                <p>The host is instantly notified of arrival via SMS or push alert. The gate is opened, and an unalterable check-in timestamp is archived in the cloud database.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. INFRASTRUCTURE RESILIENCE SECTION ── */}
      <section id="security" className={styles.resilienceSection}>
        <div className={styles.resilienceLayout}>
          <div className={styles.resilienceText}>
            <div className={styles.resilienceBadge}>Offline-First Technology</div>
            <h2>Offline-First Reliability. Zero Gate Downtime.</h2>
            <p>
              Network drops shouldn't compromise your security. Gatekeep is engineered to cache data locally at the gate terminal during internet outages, allowing continuous check-ins and automatically syncing to the cloud the moment connectivity returns.
            </p>
            <div className={styles.resilienceFeatures}>
              <div className={styles.resilienceFeatureCard}>
                <div className={styles.resIcon}>💽</div>
                <div>
                  <h4>Local IndexedDB Storage</h4>
                  <p>Keeps a local copy of all active pre-authorized codes directly in the guard terminal browser memory.</p>
                </div>
              </div>
              <div className={styles.resilienceFeatureCard}>
                <div className={styles.resIcon}>🔄</div>
                <div>
                  <h4>Silent Synchronization</h4>
                  <p>No user intervention required. When the network connects, local offline logs upload to the main database.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.resilienceVisual}>
            <div className={styles.syncVisualizer}>
              <div className={styles.nodeCloud}>
                <span className={styles.nodeIcon}>☁️</span>
                <span>Cloud Database</span>
              </div>
              <div className={styles.syncLine}>
                <div className={styles.syncArrows}>
                  <span>🡘</span>
                  <span className={styles.pulseLine}></span>
                </div>
              </div>
              <div className={styles.nodeGate}>
                <span className={styles.nodeIcon}>🚧</span>
                <span>Gate Terminal</span>
                <span className={styles.localCacheTag}>Offline Cache Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. LEAD CAPTURE FOOTER ── */}
      <section id="pilot-form" className={styles.leadSection}>
        <div className={styles.leadInner}>
          <h2>Upgrade Your Perimeter Security Today</h2>
          <p className={styles.leadSubtext}>
            Deploy a risk-free, 30-day trial at your facility or estate gate. No long-term commitment required.
          </p>

          <div className={styles.formContainer}>
            {submitSuccess ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon}>✓</div>
                <h3>Pilot Request Submitted</h3>
                <p>
                  Thank you! Your pilot request has been successfully logged.
                </p>
                <div className={styles.successOutline}>
                  <p><strong>Next Steps:</strong> A Gatekeep Security Consultant will call you within 24 hours to organize your pilot terminal configuration and sentry training.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className={styles.pilotForm}>
                {submitError && (
                  <div className={styles.formError}>
                    <span>⚠️</span> {submitError}
                  </div>
                )}
                
                <div className={styles.inputGroup}>
                  <label htmlFor="fullName" className={styles.fieldLabel}>Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="e.g. Kolawole Johnson"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="phone" className={styles.fieldLabel}>Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="e.g. 08031234567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="estateName" className={styles.fieldLabel}>Estate or Facility Name</label>
                  <input
                    id="estateName"
                    name="estateName"
                    type="text"
                    placeholder="e.g. Nigerian Army HQ Finance or Pine Crest Estate"
                    value={formData.estateName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    disabled={submitting}
                    required
                  />
                </div>

                <button type="submit" className={styles.formSubmitBtn} disabled={submitting}>
                  {submitting ? (
                    <span className={styles.loadingSpinner}></span>
                  ) : (
                    'Get Started with Gatekeep'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE WORKFLOW MODAL ── */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>×</button>
            <h3 className={styles.modalTitle}>Sentry Access Control Workflow</h3>
            <p className={styles.modalDesc}>See how Gatekeep verifies a guest in under 3 seconds.</p>

            <div className={styles.modalProgress}>
              <div className={`${styles.progressDot} ${demoStep >= 1 ? styles.dotActive : ''}`}>1. Create</div>
              <div className={`${styles.progressLine} ${demoStep >= 2 ? styles.lineActive : ''}`}></div>
              <div className={`${styles.progressDot} ${demoStep >= 2 ? styles.dotActive : ''}`}>2. Scan</div>
              <div className={`${styles.progressLine} ${demoStep >= 3 ? styles.lineActive : ''}`}></div>
              <div className={`${styles.progressDot} ${demoStep >= 3 ? styles.dotActive : ''}`}>3. Secure</div>
            </div>

            <div className={styles.modalBody}>
              {demoStep === 1 && (
                <div className={styles.demoStepBody}>
                  <div className={styles.demoVisualMock}>
                    <div className={styles.residentsAppMock} style={{ margin: '0 auto', maxWidth: '280px' }}>
                      <div className={styles.residentsAppHeader}><span>Pass Generated</span></div>
                      <div style={{ padding: '1.5rem', textAlign: 'center', background: '#111827' }}>
                        <span style={{ fontSize: '3rem' }}>🎟️</span>
                        <h4 style={{ margin: '0.5rem 0', color: '#fff' }}>Access Code: GK-9082</h4>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Sent to Kolawole Johnson via SMS</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.demoTextMock}>
                    <h4>Step 1: Host creates a pass</h4>
                    <p>The host resident generates a secure passcode via the web app. The visitor receives the details instantly via WhatsApp or SMS, ready to present at the gate.</p>
                    <button className={styles.modalCta} onClick={() => setDemoStep(2)}>Next: Sentry Scan →</button>
                  </div>
                </div>
              )}

              {demoStep === 2 && (
                <div className={styles.demoStepBody}>
                  <div className={styles.demoVisualMock}>
                    <div className={styles.phoneMockup} style={{ margin: '0 auto', maxWidth: '240px' }}>
                      <div className={styles.phoneScreen} style={{ height: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#090d16' }}>
                        <span className={styles.scanningLine}></span>
                        <div className={styles.scanTargetMock}>[ QR CODE ]</div>
                        <p style={{ color: '#fff', fontSize: '0.85rem', marginTop: '1rem' }}>Scanning visitor pass...</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.demoTextMock}>
                    <h4>Step 2: Sentry Scans Pass</h4>
                    <p>At the gate, the guard points the camera terminal at the visitor's QR code. The app decodes, matches records, and fetches authorization details in milliseconds.</p>
                    <button className={styles.modalCta} onClick={() => setDemoStep(3)}>Next: Verify & Secure →</button>
                  </div>
                </div>
              )}

              {demoStep === 3 && (
                <div className={styles.demoStepBody}>
                  <div className={styles.demoVisualMock}>
                    <div className={styles.successVerificationMock}>
                      <span className={styles.successCheckSymbol}>✓</span>
                      <h4>ACCESS GRANTED</h4>
                      <div className={styles.visitorVerifyDetails}>
                        <p><strong>Visitor:</strong> Kolawole Johnson</p>
                        <p><strong>Destination:</strong> Apartment 4B</p>
                        <p><strong>Logged:</strong> Just now (16 Jul, 01:49)</p>
                      </div>
                      <span className={styles.syncOkLabel}>Synced to Cloud</span>
                    </div>
                  </div>
                  <div className={styles.demoTextMock}>
                    <h4>Step 3: Perimeter Secured</h4>
                    <p>Approval is granted instantly. The host is notified, the barrier opens, and an unalterable audit log is written, ensuring 100% sentry accountability.</p>
                    <button className={styles.modalCta} onClick={() => setIsModalOpen(false)}>Complete Demo</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Landing;
