# 🏢 WolePass: Professional Visitor Management System

**WolePass** is a high-performance, multi-tenant Visitor Management System (VMS) designed for residential estates and commercial complexes. It simplifies the guest entry process while enhancing security through real-time OTP verification and automated billing enforcement.

---

## 🚀 Key Features

### 1. Zero-Touch Onboarding
- **Instant Provisioning:** Estate administrators can register and set up their entire estate infrastructure in seconds.
- **Paystack Integration:** Automated subscription management. Access is dynamically granted upon payment and suspended if the subscription expires.

### 2. Resident Portal
- **Pass Generation:** Residents can generate secure, 6-digit OTP visitor passes for various visit types (Personal, Dispatch, Service, etc.).
- **Real-time Notifications:** Residents get notified when their guest arrives and is checked in by security.
- **Visit History:** A complete log of all past and upcoming visitors.

### 3. Security Checkpoint (Guard App)
- **OTP Verification:** Security personnel verify visitor codes via a dedicated interface.
- **Instant Check-in:** One-click arrival logging that captures the timestamp and authorizing guard.
- **Access Control:** The system prevents check-in for expired or invalid codes.

### 4. Administrative Dashboard
- **Unit Management:** Group residents into Blocks/Suites.
- **Activity Analytics:** Overview of estate traffic, peak visiting hours, and active guests.
- **Subscription Control:** Manage estate-wide billing and access states.

---

## 🛠️ Technology Stack

- **Backend:** Laravel 11 (PHP 8.2)
- **Frontend:** React + Vite (Modern, Responsive UI)
- **Database:** Google Cloud SQL (MySQL)
- **Infrastructure:** Google Cloud Run (Containerized Deployment)
- **CI/CD:** GitHub Actions (Automated Builds & Migrations)
- **Payment Gateway:** Paystack

---

## 🏗️ Architecture & Infrastructure

### Multi-Tenancy
WolePass is built with a robust multi-tenant architecture. Every Estate (Tenant) has isolated data, ensuring security and privacy across the entire platform.

### Automated Deployment
The project uses a sophisticated CI/CD pipeline:
1. **Dockerized:** The application is containerized using a multi-stage `Dockerfile` optimized for production.
2. **Artifact Registry:** Images are stored securely in Google Cloud.
3. **Cloud Run Jobs:** Database migrations and seeding are handled by ephemeral Cloud Run Jobs to ensure zero-downtime schema updates.
4. **Cloud Run Service:** The live API is served via auto-scaling serverless containers in the `africa-south1` (Johannesburg) region.

---

## 🚦 Getting Started (Demo)

### Live API Base URL
`https://wolepass-v1-bqmnd332aa-bq.a.run.app/api`

### Demo Credentials
Use these accounts to explore the different perspectives of the system:

| Role | Email | Password |
|---|---|---|
| **Estate Admin** | `admin@wolepass.com` | `password` |
| **Security Guard** | `guard@wolepass.com` | `password` |
| **Demo Resident** | `resident1@wolepass.com` | `password` |

---

## 📜 Development
To run the backend locally:
1. Clone the repository.
2. Navigate to `wolepass-core`.
3. Run `composer install`.
4. Configure your `.env` file (see `.env.example`).
5. Run `php artisan migrate --seed`.

---

© 2026 WolePass Visitor Management. All rights reserved.
