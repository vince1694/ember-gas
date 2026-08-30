# EmberGas MERN Migration

This project has been successfully migrated to the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

- `/server`: Node.js/Express API with MongoDB/Mongoose.
- `/client`: React frontend with Vite, Framer Motion, and Axios.
- `/`: Original HTML/CSS files (kept for reference).

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Key Features Implemented

- **JWT Authentication**: Secure user registration, login, and session persistence.
- **Gas Ordering System**: Multi-step order form with dynamic pricing and validation.
- **Dashboard**: User-specific dashboard showing profile and order history.
- **Interactive UI**: Parallax scrolling, animated stats, and smooth transitions.
- **REST API**: Specialized endpoints for user auth and order management.
