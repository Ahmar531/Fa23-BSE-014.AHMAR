# Doctor Hub - Healthcare Consultation Platform

<cite index="1-1">Doctor Hub is a healthcare consultation and patient history management system where patients can search doctors according to disease and treatment type including Allopathic, Homeopathic, and Herbal doctors.</cite>

<cite index="1-25">Doctor Hub is a production-style healthcare consultation platform demonstrating advanced workflow management, appointment handling, payment verification, RBAC implementation, and secure medical history management.</cite>

## Main Features

<cite index="1-2">• Doctor search and filtering
• Appointment booking system
• Medical history sharing
• Prescription management
• Payment verification system
• Doctor assistant management
• Clinic and schedule management
• Patient-doctor communication system</cite>

## User Roles

### 🧑‍⚕️ Patient
<cite index="1-2">Book appointments, manage history, upload reports.</cite>

### 👨‍⚕️ Doctor
<cite index="1-3">Add prescriptions, manage schedules and clinics.</cite>

### 🧑‍💼 Assistant
<cite index="1-4">Verify payments and bookings.</cite>

### 🛡️ Admin
<cite index="1-5">Manage doctors and users.</cite>

### 👑 Super Admin
<cite index="1-6">Full system control.</cite>

## Appointment Workflow

<cite index="1-12,1-13,1-14,1-15,1-16,1-17,1-18,1-19,1-20,1-21,1-22,1-23">1. Patient searches doctor.
2. Patient filters doctor according to disease.
3. Patient books appointment.
4. Payment screenshot uploaded.
5. Assistant verifies payment.
6. Appointment confirmed.</cite>

## Medical History Rules

<cite index="1-7,1-8,1-9,1-10">• Medical history cannot be deleted.
• Doctors can only add new records.
• Previous prescriptions cannot be edited.
• Patients cannot remove doctor prescriptions.</cite>

## Authentication Features

<cite index="1-7">• User Registration
• Login System
• Forgot Password
• JWT Authentication
• Role-Based Access Control</cite>

## Security Features

<cite index="1-24">• JWT Authentication
• Encrypted Passwords
• Validation Middleware
• Secure APIs
• Protected Medical Records</cite>

## Tech Stack
- **Frontend:** React (Vite), React Router DOM
- **Styling:** Custom CSS with modern UI/UX principles
- **Icons:** Lucide React
- **Backend/Database:** Supabase (PostgreSQL, Auth, RLS)
- **Deployment:** Vercel

## Database Tables

<cite index="1-24">• users
• doctors
• patients
• appointments
• prescriptions
• medical_history
• payments
• assistants
• clinics</cite>

## REST APIs

<cite index="1-24">POST /api/auth/register
POST /api/auth/login
GET /api/doctors
POST /api/appointments
POST /api/payments
GET /api/history</cite>

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doctor-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup:**
   Run the provided `supabase-schema.sql` file in your Supabase SQL Editor to create the required tables and enable Row Level Security (RLS).

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   ```

## Future Enhancements

<cite index="1-24">• AI disease prediction
• Video consultation
• WhatsApp notifications
• E-prescription PDF generation</cite>

## Project Evaluation Criteria

<cite index="1-25">• Architecture Design (15 marks)
• Database Design (15 marks)
• Authentication & RBAC (10 marks)
• Workflow Logic (15 marks)
• API & Backend (10 marks)
• Frontend UX (10 marks)
• Analytics & Reports (10 marks)
• Code Quality (5 marks)
• Deployment (5 marks)
• Viva & Presentation (5 marks)</cite>

## Note on Mock Mode
If Supabase environment variables are missing, the app will automatically fall back to a "Mock Mode" utilizing `localStorage` to simulate database and authentication operations. This is useful for rapid UI prototyping.

## License
This is a final semester project demonstrating production-grade healthcare consultation platform development.

---

**Built with ❤️ as a Final Semester Project**
