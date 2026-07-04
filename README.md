# SmartGrocery

A full-stack inventory and point-of-sale management system for small grocery stores — built as a school project.

## Features

- User authentication (JWT + bcrypt password hashing)
- Inventory management (add, edit, track stock levels, reorder thresholds)
- Supplier management
- Sales tracking with itemized sale records
- Reports and dashboard overview

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** SQLite
- **Auth:** JWT, bcrypt

## Project Structure

```
smartgrocery/
├── frontend/     React app (Vite)
└── backend/      Express API + SQLite database
```

## Running locally

**Backend:**

```bash
cd backend
npm install
cp .env.example .env    # then fill in your own JWT_SECRET
npm start
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Author

Built by [Daniel (Inyene Udo-Akang)](https://github.com/Danielex223)
