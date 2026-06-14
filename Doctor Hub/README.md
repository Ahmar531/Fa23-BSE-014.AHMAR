# Doctor Hub

Doctor Hub is a comprehensive healthcare management platform designed to connect patients, doctors, assistants, and administrators in a seamless digital ecosystem.

## Features

### 🧑‍⚕️ For Patients
- **Find Doctors:** Search for specialists by city, treatment type, and rating.
- **Book Appointments:** Easy online booking system.
- **Medical History:** Keep track of all past prescriptions and medical records.
- **Real-time Notifications:** Get updates on appointment statuses.

### 👨‍⚕️ For Doctors
- **Manage Clinics:** Add and manage clinic locations, timings, and consultation fees.
- **Appointments & Prescriptions:** View daily schedules and issue digital prescriptions to patients.
- **Availability Toggle:** Go offline/online with a single click.

### 🧑‍💼 For Assistants
- **Payment Verification:** Verify patient payments securely before confirming appointments.
- **Schedule Management:** Help doctors manage their daily queues.

### 🛡️ For Admins
- **User Management:** Oversee all platform activity.
- **Doctor Approvals:** Verify and approve new doctor registrations to ensure platform quality.

## Tech Stack
- **Frontend:** React (Vite), React Router DOM
- **Styling:** Custom CSS with modern UI/UX principles
- **Icons:** Lucide React
- **Backend/Database:** Supabase (PostgreSQL, Auth, RLS)
- **Deployment:** Vercel

## Setup Instructions

1. **Clone the repository**
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
   Run the provided SQL schema in your Supabase SQL Editor to create the required tables.
5. **Run the development server:**
   ```bash
   npm run dev
   ```

## Note on Mock Mode
If Supabase environment variables are missing, the app will automatically fall back to a "Mock Mode" utilizing `localStorage` to simulate database and authentication operations. This is useful for rapid UI prototyping.
