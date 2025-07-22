# 🔐 Node.js Admin Dashboard with Role-Based Authentication

A modern, production-ready admin dashboard system with comprehensive role-based access control, built with Node.js, React, and MSSQL.

## ✨ Features

- **Role-based authentication** with hierarchical permissions
- **User management** with CRUD operations and group assignment
- **Group management** with permission matrix configuration
- **Page management** with dynamic navigation structure
- **Session-based authentication** (Laravel-style)
- **Protected routes** on both frontend and backend
- **Password hashing** with bcrypt
- **Soft delete** for data integrity
- **Admin dashboard** with data visualization

## 🏗️ Technology Stack

**Backend:** Node.js, Express.js, MSSQL, bcryptjs, express-session  
**Frontend:** React 18, Vite, Tailwind CSS, React Router  
**Security:** CORS protection, input validation, SQL injection prevention

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MSSQL Server access
- npm or yarn

### Installation
```bash
# Clone and install dependencies
git clone <repository-url>
cd project_boilerplate
npm install
cd server && npm install
cd ../client && npm install
```

### Environment Setup
Create `server/.env`:
```env
# Database Configuration
DB_SERVER=your_mssql_server
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_PORT=1433

# Session Configuration
SESSION_SECRET=your_super_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Database Initialization
```bash
cd server
node setup-db.js    # Creates tables
node seed.js        # Seeds initial data
```

### Start Development
```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend  
cd client && npm run dev
```

Visit `http://localhost:5173` to access the application.

## 🔐 Default Login

- **Email:** `test@example.com`
- **Username:** `admin`
- **Password:** `test123`
- **Role:** Superadmin (full access)

## 📁 Project Structure

```
project_boilerplate/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (auth)
│   │   └── services/      # API services
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/           # Database models
│   ├── middleware/       # Auth, validation, errors
│   ├── routes/           # Express routes
│   ├── database/         # DB connection & setup
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/check` - Check session status

### Admin Panel
- `GET /admin/users` - List all users
- `GET /admin/groups` - List all groups
- `GET /admin/pages` - List all pages
- `POST /admin/users` - Create new user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Soft delete user

### Permissions
- `GET /permissions/pages` - Get user's accessible pages

## 🚀 Production Deployment

### Build Steps
```bash
# Build frontend
cd client && npm run build

# Start production server
cd ../server && NODE_ENV=production npm start
```

### Security Checklist
- [ ] Use strong `SESSION_SECRET`
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Monitor error logs

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Built with ❤️ using Node.js, React, and MSSQL**
