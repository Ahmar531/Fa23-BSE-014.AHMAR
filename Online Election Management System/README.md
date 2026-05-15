# 🗳️ VoteSecure: Online Election Management System

VoteSecure is a complete, production-ready Secure Online Election Management System built with React, Vite, Tailwind CSS v4, and Supabase. It offers a transparent, secure, and modern platform for conducting digital elections with full auditability, role-based access control, and cryptographic security measures.

## 🚀 Features by Module

1. **Authentication:** Full JWT auth via Supabase (Login, Register, Role Selection, Forgot Password).
2. **Admin Approval:** Election creators require admin approval to publish.
3. **Election Creation:** Create elections with custom timelines, limits, and categories.
4. **Candidate Management:** Assign candidates to specific polls within elections.
5. **Public Landing Page:** Beautiful public-facing catalog of active and upcoming elections.
6. **Voter Registration:** Users must explicitly register to participate before deadlines.
7. **Locking & Finalization:** Voter lists lock when maximums are reached or deadlines pass.
8. **Secret Voter ID:** (Logic prepared) Cryptographically hashed IDs separate identity from ballots.
9. **Voting Module:** Anonymous vote casting protected by Row Level Security (RLS).
10. **Live Results:** Real-time vote counting and progress charts using Recharts.
11. **Audit & Transparency:** Every sensitive action logs to an immutable audit trail.
12. **Role Dashboards:** Distinct dashboards for Admins, Creators, and Voters.
13. **Security:** PostgreSQL Row Level Security enforces zero-trust data access.

## 💻 Technology Stack

- **Frontend:** React 18, Vite, React Router v6
- **Styling:** Tailwind CSS v4, Framer Motion, Lucide React
- **Data Fetching:** Supabase JS Client
- **Charts:** Recharts
- **Backend/Database:** Supabase (PostgreSQL, Auth, RLS)

## 🛠️ Setup Instructions

### 1. Supabase Backend Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Copy the entire contents of `supabase/schema.sql` and run it. This will create all tables, configure foreign keys, and set up the Row Level Security (RLS) policies.
4. Go to Project Settings -> API and copy your `Project URL` and `anon public key`.

### 2. Frontend Local Setup
1. Clone the repository.
2. Run `npm install` to install all dependencies.
3. Create a `.env` file in the root directory based on `.env.example`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run `npm run dev` to start the local development server.

## 🌐 Deployment (Vercel)

1. Push your code to a public GitHub repository.
2. Go to [Vercel](https://vercel.com) and click "Add New Project".
3. Import your GitHub repository.
4. In the Environment Variables section, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will automatically detect the Vite React configuration and build the app.

## 🎨 UI/UX Design

The application utilizes a premium "glassmorphism" design aesthetic:
- **Color Palette:** Deep Blue (`#1e3a8a`) primary, Teal (`#0d9488`) accent, with custom subtle gradients.
- **Typography:** `Inter` for standard text and `Poppins` for dynamic headers.
- **Animations:** Smooth page transitions, animated countdown timers, flip clocks, and pulse effects.
- **Mobile First:** The application is fully responsive via a collapsible sidebar and hamburger navigation.

## 🧪 Testing

To test the role-based system locally without requiring an email confirmation first (if you disabled email confirmations in Supabase):
1. Register a new user and select the **Admin** or **Election Creator** role.
2. In Supabase, you can manually toggle the `verified` flag or promote a user to `super_admin` in the `users` table.
