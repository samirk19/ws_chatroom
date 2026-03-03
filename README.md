# RoomChat

A real-time chat application with persistent message storage. Built with React, FastAPI, PostgreSQL, and WebSockets.


## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- WebSocket API (native browser)

**Backend:**
- Python 3.11+
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- JWT Authentication (python-jose)
- bcrypt Password Hashing

## Prerequisites

### System Requirements
- Python 3.11 or higher
- Node.js 18+ and npm
- PostgreSQL 12+ running locally

### Check Your Setup
```bash
python3 --version      # Should be 3.11+
node --version         # Should be 18+
npm --version          # Should be 9+
psql --version         # Should be 12+
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/samirk19/ws_chatroom.git
cd ws_chatroom
```

### 2. Set Up PostgreSQL Database

```bash
psql postgres

CREATE DATABASE chatapp;

\q
```

**Optional: Create a dedicated database user**
```bash
psql postgres

CREATE USER chatapp_user WITH PASSWORD 'your_password_here';
ALTER ROLE chatapp_user SET client_encoding TO 'utf8';
ALTER ROLE chatapp_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE chatapp_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE chatapp TO chatapp_user;

\q
```

### 3. Set Up Backend

```bash
cd backend

pip install -r requirements.txt

# Create .env file with database credentials
cat > .env << EOF
DATABASE_URL=postgresql://samirkhattak@localhost/chatapp
SECRET_KEY=your-secret-key-here-change-in-production
EOF
```

**Update `DATABASE_URL` if using custom user:**
```
DATABASE_URL=postgresql://chatapp_user:your_password_here@localhost/chatapp
```

### 4. Set Up Frontend

```bash
cd ../frontend

npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
EOF
```

## Running the Development Servers

### FastAPI Server

```bash
cd backend
uvicorn main:app --reload
```

### React Dev Server

```bash
cd frontend
npm run dev
```

### Access the App

Open your browser and go to: **http://localhost:3000**

## API Endpoints

### Authentication
- `POST /api/register` — Create new user
- `POST /api/login` — Login user
- `GET /api/me` — Get current user (requires auth)

### Rooms
- `GET /api/rooms` — List all rooms
- `POST /api/rooms` — Create new room (requires auth)
- `DELETE /api/rooms/{room_id}` — Delete room (only by creator)

### Messages
- `GET /api/rooms/{room_id}/messages` — Get message history (last 50)

### WebSocket
- `WS /ws/{room_id}?token={jwt_token}` — Connect to room for real-time messages

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE rooms (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_by VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    room_id VARCHAR(36) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Backend won't start: "permission denied for schema public"

Fix database permissions:
```bash
psql -U samirkhattak -d chatapp

GRANT ALL ON SCHEMA public TO samirkhattak;
ALTER SCHEMA public OWNER TO samirkhattak;

\q
```

## Security Notes

- Passwords are hashed with bcrypt (salted, 12 cost factor)
- JWTs expire after 7 days
- WebSocket token passed as query param (browser limitation)
- For production, use HTTPS/WSS and strong `SECRET_KEY`

## Development Commands

```bash
# Backend
cd backend
pip install -r requirements.txt    # Install dependencies
uvicorn main:app --reload          # Start dev server
python3 seed_db.py                 # Seed database

# Frontend
cd frontend
npm install                        # Install dependencies
npm run dev                        # Start dev server
npm run build                      # Build for production
npm run lint                       # Run ESLint
```

## Next Steps / Future Enhancements

- [ ] File upload support
- [ ] User profiles & avatars
- [ ] Direct messaging
- [ ] Message reactions/emoji
- [ ] Read receipts
- [ ] User typing indicator
- [ ] Message search
- [ ] Dark/light theme toggle
- [ ] Message editing & deletion
- [ ] User roles & permissions

## License

MIT
