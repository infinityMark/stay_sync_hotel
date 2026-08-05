# stay_sync_hotel

A full-stack hotel management system developed as a personal project.  
It provides core front‑desk functionalities:

- Room type and inventory management
- Customer reservation and check‑in/out
- Billing and payment recording
- Daily revenue statistics

## Tech Stack

- **Backend:** Node.js (Express.js) with TypeScript, Prisma ORM, JWT authentication
- **Frontend:** React 18 + Vite + React Router v6 + Zustand (state management)
- **Database:** PostgreSQL
- **Build Tools:** npm / pnpm (both backend and frontend)
- **API Communication:** RESTful API with JSON (axios on frontend)

## Project Structure

The project is split into two main folders (both in the same repository):
```
Hotel_System/
├── backend/ # Node.js + Express application
└── frontend/ # React + Vite application
```
This separation keeps backend and frontend code clean and independently deployable.

### Frontend Structure
```
src/
├── layouts/       (Header + Sidebar wrapper)
├── pages/         (Dashboard, Rooms, Bookings, Reports)
├── components/    (Reusable UI parts)
├── stores/        (Zustand state - like Pinia)
└── api/           (Axios requests)
```