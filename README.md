# SmartGrocery

A full-stack inventory and point-of-sale management system for small grocery stores, built as a school project.

## Features

- User authentication (JWT + bcrypt password hashing)
- Inventory management (add, edit, track stock levels, reorder thresholds)
- Supplier management
- Sales tracking with itemized sale records
- Reports and dashboard overview
- Light/dark theme toggle

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** SQLite
- **Auth:** JWT, bcrypt

## Project Structure

- `frontend/` — React app (Vite)
- `backend/` — Express API + SQLite database

## Running locally

**Backend:**

```bash
cd backend
npm install
cp .env.example .env
npm start
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Other Projects

- **[GGCHAT](https://github.com/Danielex223/ggchat)** — Real-time messaging platform with synced YouTube watch parties, friends system, and group admin controls. [Live demo](https://ggchat-git-main-danielex223s-projects.vercel.app/)
- **[BudgetIQ](https://github.com/Danielex223/budgetiq)** — Personal finance SaaS with budget tracking and spending analytics. [Live demo](https://budgetiq-one.vercel.app/)

## Author

Built by [Daniel (Inyene Udo-Akang)](https://github.com/Danielex223)
