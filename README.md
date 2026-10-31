# Student Wellbeing Platform

A comprehensive mental health and wellbeing platform designed for university students, faculty counselors, and administrators.

## Project Structure
- `SWA_BACKEND/`: Express.js & MongoDB backend (REST API, authentication, appointment scheduling, assessments, mood tracking, discussion forums).
- `SWA_FRONTEND/`: React + Vite frontend SPA with role-based routing (Student, Counselor, Admin).

## Setup & Running Locally

### Backend Setup (`SWA_BACKEND`)
1. Open a terminal in `SWA_BACKEND`:
   ```bash
   cd SWA_BACKEND
   npm install
   ```
2. Configure `.env`:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JOURNAL_SECRET=your_journal_secret
   ```
3. Run the server:
   ```bash
   npm start
   # or
   node server.js
   ```

### Frontend Setup (`SWA_FRONTEND`)
1. Open a terminal in `SWA_FRONTEND`:
   ```bash
   cd SWA_FRONTEND
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Features
- **Confidential Student Assessment**: WHO-5, GHQ-12, PHQ-9, GAD-7, and MBI standardized screenings.
- **Counselor Appointment Booking**: 6 daily time slots with real-time double-booking prevention.
- **Mood Tracking & Journaling**: End-to-end encrypted personal reflection journals.
- **Role-based Authentication**: JWT-based protection with dedicated views for Students, Counselors, and Admins.
