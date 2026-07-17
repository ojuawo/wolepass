import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
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
        Privacy Policy
      </h1>
      <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '3rem' }}>
        Last Updated: July 17, 2026
      </p>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          1. Introduction
        </h2>
        <p>
          At <strong>Gatekeep</strong>, we are committed to protecting the privacy and security of personal data collected at secure perimeters. This Privacy Policy details how we process personal information in connection with our Visitor Management System (VMS) platform, adhering to the <strong>Nigeria Data Protection Regulation (NDPR)</strong> and other applicable privacy rules.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          2. Information We Collect
        </h2>
        <p>
          To facilitate secure access control, the Service collects the following categories of data on behalf of estate and office managers:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><strong>Resident Information:</strong> Name, email address, telephone number, and residential unit designation.</li>
          <li><strong>Visitor Information:</strong> Name, phone number, vehicle registration number (if applicable), and host unit.</li>
          <li><strong>Log Metadata:</strong> Access code generation timestamps, gate entry and exit verification timestamps, and security guard ID responsible for verification.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          3. How We Use Collected Data
        </h2>
        <p>
          The personal data collected is used strictly for safety and access control auditing:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>To generate and verify temporary QR codes/OTPs for visitors.</li>
          <li>To notify residents in real-time when their visitors arrive at the main gate.</li>
          <li>To provide estate managers with a secure, read-only digital audit trail of perimeter check-ins for investigation purposes in the event of security breaches.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          4. Data Sharing & Third-Party Services
        </h2>
        <p>
          Gatekeep does not sell, rent, or trade visitor or resident data to any third-party marketing companies. Data is only accessible to:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>The specific resident who generated the visitor pass.</li>
          <li>Authorized gate security personnel and estate administrators.</li>
          <li>Law enforcement agencies, strictly upon presentation of a valid warrant or official legal inquiry related to a security incident.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          5. Data Security & Storage
        </h2>
        <p>
          All data is transmitted securely via SSL/TLS encryption. Visitor and resident data is stored in secure database environments using tokenized access controls. Gate terminals cache local access databases inside encrypted sandbox storage to enable offline validation at estate gates.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#000000' }}>
          6. Retention & Deletion Rights
        </h2>
        <p>
          In accordance with standard safety audits and the NDPR, visitor check-in logs are archived and retained for a minimum period necessary to maintain estate safety. Residents and visitors may request information regarding what personal details are held on the system. Requests for deletion will be processed in coordination with the respective estate's management board to ensure compliance with local perimeter audit regulations.
        </p>
      </section>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2.5rem', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Gatekeep VMS. All rights reserved. For privacy requests, contact privacy@gatekeep.com.ng
        </p>
      </div>
    </div>
  );
}
