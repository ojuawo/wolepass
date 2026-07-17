import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '4rem 2rem 6rem',
      fontFamily: "'Roboto', sans-serif",
      color: '#000000',
      lineHeight: '1.7',
      backgroundColor: '#ffffff'
    }}>
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
        color: '#4b5563',
        fontSize: '0.9rem',
        fontWeight: '500',
        marginBottom: '2.5rem',
        transition: 'color 0.2s ease'
      }}
      onMouseEnter={(e) => e.target.style.color = '#000000'}
      onMouseLeave={(e) => e.target.style.color = '#4b5563'}
      >
        ← Back to Home
      </Link>

      <h1 style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: '2.5rem',
        fontWeight: '800',
        letterSpacing: '-0.02em',
        marginBottom: '0.5rem',
        color: '#000000'
      }}>
        Terms of Service
      </h1>
      <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '3rem' }}>
        Last Updated: July 17, 2026
      </p>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using <strong>Gatekeep</strong> (referred to as "the Service"), provided by Gatekeep VMS, you agree to be bound by these Terms of Service. If you are using the Service on behalf of an estate, corporate office, or organization, you represent that you have the authority to bind that entity to these terms.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          2. Description of Service
        </h2>
        <p>
          Gatekeep provides a digital Visitor Management System (VMS) designed to facilitate visitor pre-registration, generate temporary check-in codes, and store visitor access logs for security auditing. The Service is offered as a Cloud-hosted platform with offline-sync terminal capabilities at physical gate perimeters.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          3. Account Registration & Security
        </h2>
        <p>
          To utilize the Service, estates must register an Admin Account. Residents must register accounts bound to their respective units, subject to approval by the estate's administrator. You are responsible for safeguarding your login credentials. Any activity conducted under your account is your sole responsibility.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          4. Acceptable Use & Estate Responsibility
        </h2>
        <p>
          Estate administrators and residents agree not to misuse the Service. You shall not:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Generate visitor passes for fraudulent or illegal purposes.</li>
          <li>Input incorrect or mock visitor data deliberately to bypass security checks.</li>
          <li>Intercept, reverse engineer, or disrupt offline synchronization services at the gate.</li>
        </ul>
        <p>
          The estate remains fully responsible for all security personnel acting as operators on physical gate terminals.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          5. Data Ownership & Audit Trail Integrity
        </h2>
        <p>
          Visitor names, telephone numbers, vehicle registration numbers, and arrival timestamps are collected to construct estate security logs. Gatekeep acts as a data processor on behalf of the registered estate. 
        </p>
        <p>
          Audit logs are tamper-resistant. Once a visitor is checked in at the gate, the corresponding access log cannot be modified by residents or security personnel, ensuring administrative and legal audit integrity.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          6. Limitation of Liability
        </h2>
        <p>
          Gatekeep provides access control software tools. The Service does not replace physical guard training, perimeter physical security (fencing, gates, cameras), or local police dispatch. Under no circumstances shall Gatekeep be liable for unauthorized entries, property damage, or security breaches occurring at user facilities.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          7. Governing Law
        </h2>
        <p>
          These Terms of Service are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Nigeria.
        </p>
      </section>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2.5rem', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Gatekeep VMS. All rights reserved. For legal inquiries, contact legal@gatekeep.com.ng
        </p>
      </div>
    </div>
  );
}
