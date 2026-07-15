# 🏢 GateKeep: Professional Visitor Management System

**GateKeep** is a high-performance, multi-tenant Visitor Management System (VMS) designed for residential estates and commercial complexes. It simplifies the guest entry process while enhancing security through real-time OTP verification and automated billing enforcement.

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
- **Resident Onboarding Panel:** Approve or reject self-registered resident requests before they gain access.

---

## 🛠️ Technology Stack

- **Backend:** Laravel 11 (PHP 8.2)
- **Frontend:** React + Vite (Modern, Responsive UI)
- **Database:** MySQL
- **Infrastructure:** Go54 Shared/VPS Hosting
- **CI/CD:** GitHub Actions (Automated FTP/SFTP Builds & Deployments)
- **Payment Gateway:** Paystack

---

## 🏗️ Architecture & Infrastructure

### Multi-Tenancy
GateKeep is built with a robust multi-tenant architecture. Every Estate (Tenant) has isolated data, ensuring security and privacy across the entire platform.

### Automated Deployment
The project uses an automated GitHub Actions deployment pipeline:
1. **Frontend Build:** The React application is built, optimized, and deployed to your main web directory (e.g. `public_html/`).
2. **Backend Deployment:** Composer dependencies are prepared, and the backend core is safely deployed.

---

## 🚦 Getting Started (Demo)

### Live API Base URL
`https://api.gatekeep.com.ng/api`

### Demo Credentials
Use these accounts to explore the different perspectives of the system:

| Role | Email | Password |
|---|---|---|
| **Estate Admin** | `admin@gatekeep.com.ng` | `password` |
| **Security Guard** | `guard@gatekeep.com.ng` | `password` |
| **Demo Resident** | `adebayo.0@demo.gatekeep.com.ng` | `password` |

---

## 📜 Development
To run the backend locally:
1. Clone the repository.
2. Navigate to `wolepass-core`.
3. Run `composer install`.
4. Configure your `.env` file (see `.env.example`).
5. Run `php artisan migrate --seed`.

---

## 🔑 Deployment Secrets
Add these credentials to GitHub Actions secrets:
- `GO54_FTP_SERVER` - Your FTP server address.
- `GO54_FTP_USERNAME` - The FTP username.
- `GO54_FTP_PASSWORD` - The FTP password.

---

© 2026 GateKeep Visitor Management. All rights reserved.
