# MedVault — Secure Digital Medical Records System

MERN stack application for secure storage and sharing of medical records.

## 🚀 Features

### 👤 Patient Functions
- **Register/Login** - Secure authentication with JWT tokens
- **Upload Medical Records** - PDFs, images, lab reports, prescriptions
- **View & Manage Records** - Download, delete, organize with search and filters
- **Share Records** - Share with doctors through secure access with expiry
- **Avatar Selection** - Choose from male/female avatar options
- **Access Control** - View which doctors have access via dashboard card
- **Revoke Access** - Stop doctor from seeing records anytime
- **Profile Management** - Complete profile with security, privacy, and account settings

### 🩺 Doctor Functions
- **Doctor Login** - Secure authentication for medical professionals
- **Patient Search** - Search patients by name with real-time results
- **View Patients** - Patients who shared access with detailed information
- **View Shared Medical Records** - Lab results, prescriptions, scans with full details
- **Download Medical Files** - Secure file download with access verification
- **Request Access** - Send access requests to patients (general or specific records)
- **Detailed Record View** - Complete record information with patient data
- **Profile Management** - Enhanced profile with specialization and license info

## 🔄 Complete Workflow

1. **User Registration** - Patient or Doctor creates account with secure password hashing
2. **Patient Uploads Records** - Files stored securely with metadata in MongoDB
3. **Patient Shares/Grants Access** - Select doctors and set access permissions
4. **Doctor Requests Access** - Search patients and request general or specific access
5. **Secure Access Control** - Only patients control who sees their records
6. **Dashboard Management** - Both users see comprehensive dashboards with access cards

## Tech Stack

- **Frontend:** React, React Router v6, Tailwind CSS, Axios, Context API, Framer Motion
- **Backend:** Node.js, Express, MongoDB, Mongoose, Multer + GridFS, JWT (Access + Refresh), Bcrypt, Helmet, CORS
- **Security:** HIPAA-compliant access controls, audit logging, encrypted storage

## Setup

### 1. Install dependencies

From the project root:

```bash
npm run install:all
```

Or manually:

```bash
npm install
cd backend && npm install --legacy-peer-deps
cd ../frontend && npm install
```

### 2. Environment variables

**Backend** — copy `backend/.env.example` to `backend/.env` and set:

- `MONGO_URI` — MongoDB connection string (e.g. Atlas)
- `MONGO_USERNAME` / `MONGO_PASSWORD` — if not included in URI
- `JWT_SECRET` — secret for access tokens
- `REFRESH_SECRET` — secret for refresh tokens
- `PORT` — server port (default 5000)
- `FRONTEND_URL` — e.g. `http://localhost:3000`

**Frontend** (optional) — create `frontend/.env`:

- `REACT_APP_API_URL` — e.g. `http://localhost:5000/api` (defaults to this if not set)

### 3. Test the system

```bash
npm run test:system
```

### 4. Run the app

From the project root:

```bash
npm run dev
```

This starts:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

Or run separately:

```bash
npm run server   # backend only
npm run client   # frontend only
```

## 🔧 Fixed Issues

- ✅ **Audit Log Validation** - Added missing action types (AVATAR_UPDATE, REVOKE_ACCESS, DELETE_RECORD)
- ✅ **API Endpoints** - Fixed all record fetching to use `/records/my-records`
- ✅ **Avatar System** - Replaced file upload with URL-based avatar selection
- ✅ **Access Requests** - Made recordId optional for general access requests
- ✅ **Patient Dashboard** - Added access card showing doctor permissions
- ✅ **Doctor Record View** - Complete detailed view with patient information
- ✅ **Search Functionality** - Real-time patient search for doctors
- ✅ **Profile Management** - Full CRUD operations for all user fields

## API Overview

### Authentication
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Refresh token
- `POST /api/auth/forgot` — Forgot password
- `POST /api/auth/reset` — Reset password

### Records
- `GET /api/records/my-records` — Get current user's records
- `GET /api/records/access-summary` — Get access summary for dashboard
- `POST /api/records/upload` — Upload file (multipart)
- `POST /api/records/share/:recordId` — Share record with doctor
- `PATCH /api/records/:recordId/revoke` — Revoke doctor access
- `GET /api/records/view/:recordId` — View record metadata
- `GET /api/records/download/:recordId` — Download file
- `DELETE /api/records/:recordId` — Delete record

### Doctor Functions
- `GET /api/doctor/shared` — Shared records (doctor)
- `GET /api/doctor/search-patients` — Search patients by name
- `POST /api/doctor/request` — Request access (general or specific)
- `GET /api/doctor/requests` — Doctor's access requests
- `GET /api/doctor/patients` — Patients who shared records

### User Management
- `GET /api/user/profile` — Get user profile
- `PATCH /api/user/profile` — Update profile
- `PATCH /api/user/avatar` — Update avatar URL
- `GET /api/requests` — Access requests (patient)
- `PATCH /api/requests/:id/respond` — Approve/Reject (patient)
- `GET /api/audit` — Activity logs

## Project Structure

```
medvault/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── test-system.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AccessCard.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── Profile.jsx
│   │   │   ├── ProfileSecurity.jsx
│   │   │   ├── ProfileAccounts.jsx
│   │   │   ├── ProfilePrivacy.jsx
│   │   │   ├── DoctorRecordView.jsx
│   │   │   └── ...
│   │   ├── utils/
│   │   └── App.js
│   └── public/
└── package.json
```

## 🔒 Security Features

- **HIPAA Compliance** - Secure medical record handling
- **JWT Authentication** - Access and refresh token system
- **Audit Logging** - Complete activity tracking
- **Access Control** - Patient-controlled record sharing
- **Data Encryption** - Secure file storage and transmission
- **Input Validation** - Comprehensive data sanitization

## License

MIT
