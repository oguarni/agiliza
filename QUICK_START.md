# Quick Start Guide

## Prerequisites Check
```bash
node --version  # Should be v18+
npm --version
psql --version  # Should be v12+
```

## 🚀 5-Minute Setup

### 1. Create Database
```bash
createdb task_management_dev
# OR
psql -U postgres -c "CREATE DATABASE task_management_dev;"
```

### 2. Run Migrations
```bash
cd backend
npm run db:migrate
```

You should see:
```
Sequelize CLI [Node: xx.x.x, CLI: x.x.x, ORM: x.x.x]

Loaded configuration file "src/config/database.js".
Using environment "development".
== 20240101000001-create-users-table: migrating =======
== 20240101000001-create-users-table: migrated (0.XXXs)

== 20240101000002-create-tasks-table: migrating =======
== 20240101000002-create-tasks-table: migrated (0.XXXs)
```

### 3. Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 3001
Environment: development
Database connection established successfully
```

### 4. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v4.4.5  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 5. Open Browser
Navigate to: **http://localhost:3000**

## ✅ Verification

### Test Backend API
```bash
# Health check
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","message":"Server is running"}
```

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com"
    }
  }
}
```

## 🧪 Run Tests
```bash
cd backend
npm test
```

Expected output:
```
PASS  src/services/AuthService.test.ts
PASS  src/services/TaskService.test.ts
Test Suites: 2 passed
Tests:       17 passed
```

## 🔧 Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL if needed
sudo service postgresql start

# Verify database exists
psql -U postgres -l | grep task_management
```

### Port Already in Use
```bash
# Backend (port 3001)
lsof -ti:3001 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Reset Database
```bash
cd backend

# Drop and recreate database
dropdb task_management_dev
createdb task_management_dev

# Run migrations again
npm run db:migrate
```

### Clear Frontend Build
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

## 📱 Using the Application

### 1. Register an Account
- Click "Register here"
- Enter: Name, Email, Password (min 6 characters)
- Click "Register"

### 2. Create a Task
- Click "Add Task"
- Enter: Title (required), Description, Priority
- Click "Create Task"

### 3. Manage Tasks
- **Complete:** Click "Complete" button
- **Delete:** Click "Delete" button (with confirmation)
- View all your tasks in the list

### 4. Logout
- Click "Logout" in the top right

## 🎯 Default Values

- **Backend Port:** 3001
- **Frontend Port:** 3000
- **Database Host:** 127.0.0.1
- **Database Port:** 5432
- **Database Name:** task_management_dev
- **Database User:** postgres
- **JWT Expiration:** 7 days

## 📚 Next Steps

- [ ] Add more tasks to test the system
- [ ] Try different task priorities (low, medium, high)
- [ ] Test the authorization (create another user and verify tasks are separate)
- [ ] Run the test suite
- [ ] Review the code architecture
- [ ] Customize the UI styling
- [ ] Add more features (tags, due dates, etc.)

## 🆘 Need Help?

1. Check the full README.md for detailed documentation
2. Review SETUP_COMPLETE.md for implementation details
3. Check the code comments in the source files
4. Verify all environment variables in backend/.env

---

**Happy Coding! 🚀**
