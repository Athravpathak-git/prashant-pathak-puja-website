# PROJECT REPORT 15: DEPLOYMENT & ENVIRONMENT CONFIGURATION

---

## 1. Executive Summary
The **Vedmurti Prashant Shriprasad Pathak (Guruji) Website** is packaged as an independent Node.js enterprise application. It can be deployed on any standard virtual private server (Linux/Windows), bare-metal server, or containerized cloud infrastructure supporting Node.js 18+ and PostgreSQL 14+.

---

## 2. Environment Variables & Secret Governance

The application requires configuration through a local `.env` file at the project root. (A template is provided in `.env.example`).

### Standard Configuration Variables (Secrets Sanitized)

| Variable Name | Environment | Purpose / Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Server | `postgresql://prashant_pathak_app:<SECRET>@localhost:5432/prashant_pathak_puja_db` |
| `DB_HOST` | Server | `localhost` |
| `DB_PORT` | Server | `5432` |
| `DB_USER` | Server | `prashant_pathak_app` |
| `DB_PASSWORD` | Server | `<SECRET>` |
| `JWT_SECRET` | Server | `<SECRET_LONG_CRYPTOGRAPHIC_KEY_MIN_32_CHARS>` |
| `ADMIN_DEFAULT_USER` | Server / Seed | `admin` |
| `ADMIN_DEFAULT_PASS` | Server / Seed | `<INITIAL_SEED_PASSWORD>` |
| `WHATSAPP_PHONE` | Server (Private)| Guruji's Private WhatsApp Number (Strictly server-side only) |
| `WHATSAPP_PUBLIC_USERNAME` | Public / SSR | `@PrashantPathakGuruji` |
| `NEXT_PUBLIC_WHATSAPP_USERNAME`| Client / Browser| `@PrashantPathakGuruji` |
| `NEXT_PUBLIC_SITE_URL` | Public / Metadata | `http://localhost:3000` (or `https://prashantpathak.org`) |
| `NODE_ENV` | Runtime | `production` (or `development`) |

*(Note: In accordance with project safety rules, all secrets and personal phone numbers are withheld from documentation.)*

---

## 3. Database Initialization & Schema Deployment

### 3.1 Step 1: Dedicated PostgreSQL Database Creation
The PostgreSQL database and dedicated service user must be provisioned independently:
```sql
-- Execute as PostgreSQL superuser (postgres)
CREATE DATABASE prashant_pathak_puja_db;
CREATE USER prashant_pathak_app WITH ENCRYPTED PASSWORD '<SECRET>';
GRANT ALL PRIVILEGES ON DATABASE prashant_pathak_puja_db TO prashant_pathak_app;
\c prashant_pathak_puja_db
GRANT ALL ON SCHEMA public TO prashant_pathak_app;
```

### 3.2 Step 2: Automated Schema & Seed Execution
Execute the automated initialization harness:
```bash
node scripts/init-db.mjs
```
This script:
1. Validates connection credentials against `prashant_pathak_puja_db` and user `prashant_pathak_app`.
2. Applies the DDL schema from `src/lib/schema.sql` (17 tables, 11 indexes).
3. Inserts the application metadata marker (`prashant_pathak_guruji_website`).
4. Seeds the initial administrator account with salted bcrypt hash.
5. Populates baseline puja ceremonies, categories, and homepage sections.

---

## 4. Application Build & Production Execution

### 4.1 Step 1: Dependency Installation
```bash
npm install
```

### 4.2 Step 2: Production Compilation
```bash
npm run build
```
Executes TypeScript type checking, Webpack trace bundling, and pre-renders static and dynamic App Router routes into the `.next/` standalone build distribution.

### 4.3 Step 3: Launch Production Web Server
```bash
npm run start
```
By default, the Next.js server binds to port `3000` (`http://localhost:3000`).

---

## 5. Storage & Persistence Configuration
- **Directory:** `uploads/` (located at project root).
- **Permissions:** The Node.js runtime process requires read and write filesystem permissions on `uploads/`.
- **Serving:** Assets stored in `uploads/` are streamed publicly via `/api/uploads/[filename]` with path traversal verification and immutable caching headers.

---

## 6. Enterprise Process Management (Recommended for Linux VPS)

For continuous production uptime, process supervision using **PM2** is recommended:
```bash
# Install PM2 globally
npm install -g pm2

# Start Application with PM2 Cluster or Fork
pm2 start npm --name "prashant-pathak-website" -- run start

# Configure Startup Hook
pm2 startup
pm2 save
```

### Reverse Proxy Configuration (Nginx Example)
```nginx
server {
    listen 80;
    server_name prashantpathak.org www.prashantpathak.org;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 12M;
    }
}
```

---

## 7. Backup & Disaster Recovery Procedures

### 7.1 PostgreSQL Database Backup (`pg_dump`)
```bash
# Scheduled Daily Backup
pg_dump -U prashant_pathak_app -h localhost -d prashant_pathak_puja_db -F c -b -v -f "/backup/db/prashant_pathak_puja_db_$(date +%Y%m%d_%H%M%S).dump"
```

### 7.2 Media Assets Backup
```bash
# Backup uploads folder
tar -czvf "/backup/media/uploads_$(date +%Y%m%d_%H%M%S).tar.gz" ./uploads
```

---
*Deployment guide verified against `package.json`, `next.config.mjs`, and `.env.example`.*
