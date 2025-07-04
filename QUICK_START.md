# Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Access to an existing MSSQL Server with a Users table
- npm or yarn

### 1. Database Requirements
This boilerplate connects to an existing MSSQL database. Ensure your database has a Users table with these columns:

```sql
Users Table Requirements:
- id (INT, IDENTITY, PRIMARY KEY)
- username (NVARCHAR(50), UNIQUE)
- email (NVARCHAR(100), UNIQUE)  
- password_hash (NVARCHAR(255))
- first_name (NVARCHAR(50))
- last_name (NVARCHAR(50))
- created_at (DATETIME2)
- updated_at (DATETIME2)
- last_login (DATETIME2, NULL)
```

### 2. Environment Configuration
1. Copy `server/.env.example` to `server/.env`
2. Update the database connection details:
   ```env
   DB_SERVER=your_server_name
   DB_DATABASE=your_existing_database
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_PORT=1433
   ```

### 3. Install Dependencies
Run the setup script or install manually:

**Option A: Automated setup (Windows)**
```bash
setup.bat
```

**Option B: Manual installation**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Start the Application
```bash
# From project root - starts both server and client
npm run dev
```

**Or start individually:**
```bash
# Start server (port 5000)
npm run server:dev

# Start client (port 3000)
npm run client:dev
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 🔐 Default Login
After running the database schema, you can login with:
- **Username:** admin
- **Password:** admin123

## 📁 Project Structure
```
project_boilerplate/
├── server/                 # Backend (Node.js + Express)
│   ├── controllers/        # Route controllers (MVC)
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   ├── routes/            # API routes
│   ├── database/          # Database config & schemas
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (state management)
│   │   ├── services/      # API service functions
│   │   └── utils/         # Utility functions
│   └── public/
└── README.md
```

## 🛠️ Available Scripts

### Root Package
- `npm run dev` - Start both server and client
- `npm run server:dev` - Start server in development mode
- `npm run client:dev` - Start client in development mode
- `npm run install:all` - Install all dependencies

### Server Scripts
- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon

### Client Scripts
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user (protected)
- `POST /api/auth/refresh` - Refresh JWT token (protected)
- `POST /api/auth/logout` - Logout (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `POST /api/users/change-password` - Change password (protected)
- `DELETE /api/users/account` - Delete account (protected)

## 🔧 Customization

### Adding New Routes
1. Create controller in `server/controllers/`
2. Add routes in `server/routes/`
3. Register routes in `server/server.js`

### Adding New Pages
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.js`
3. Add navigation links if needed

### Database Changes
1. Update models in `server/models/`
2. Create migration scripts if needed
3. Update validation schemas

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
- Verify MSSQL Server is running
- Check connection details in `.env`
- Ensure database exists and schema is applied

**Port Already in Use**
- Server: Change `PORT` in `server/.env`
- Client: Set `PORT=3001` in `client/.env`

**CORS Errors**
- Verify `CLIENT_URL` in `server/.env`
- Check if client is running on correct port

### Debug Mode
Set `NODE_ENV=development` in `server/.env` for detailed error messages.

## 📝 Environment Variables

### Required Server Variables
```env
# Database
DB_SERVER=localhost
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Optional Client Variables
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Server Deployment
1. Set `NODE_ENV=production`
2. Update database connection for production
3. Set secure JWT secret
4. Configure CORS for production domain

### Client Deployment
1. Build the app: `npm run build`
2. Serve the `build` folder
3. Update API URL for production

### Docker Support
Docker configuration can be added for containerized deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this boilerplate for your projects!
