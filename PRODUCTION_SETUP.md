# Production Setup Guide

## Database Setup

### 1. Create Database Tables
Run the following SQL scripts in order:

```bash
# 1. Create the main users table
server/database/create_users_dash.sql

# 2. Create admin tables (Groups, Pages, PageGroup)
server/database/admin_schema.sql
```

### 2. Create Your First Admin User
After creating the tables, manually insert your first superadmin user:

```sql
-- Replace 'your_password_hash' with a properly hashed password
-- Use tools like bcrypt to generate the hash
INSERT INTO Groups (groupName, createdBy, createdDateTime, isActive)
VALUES ('superadmin', 'system', GETDATE(), 1);

INSERT INTO users_dash (
    name, username, email, password, designation, 
    contact, district, idGroup, status, createdBy, created_at, isNewUser
)
VALUES (
    'System Administrator',
    'admin',
    'admin@yourcompany.com',
    'your_bcrypt_hashed_password_here',
    'superadmin',
    'your_contact',
    'your_district',
    1,
    1,
    'system',
    GETDATE(),
    0
);
```

## Environment Configuration

### Server (.env)
```env
# Database Configuration
DB_SERVER=your_server
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true

# Session Configuration
SESSION_SECRET=your_secure_session_secret_here

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
CLIENT_URL=https://your-frontend-domain.com
```

### Client (.env)
```env
VITE_API_URL=https://your-api-domain.com/api
```

## Admin Panel Features

### User Management (`/admin/users`)
- Create, edit, delete users
- Assign users to groups
- Manage user status and permissions

### Group Management (`/admin/groups`)
- Create user roles/groups
- Configure group permissions
- Manage group status

### Page Management (`/admin/pages`)
- Configure navigation structure
- Set parent/child relationships
- Manage menu ordering and visibility

## Access Control

- Only users with `designation = 'superadmin'` can access admin panels
- All admin routes are protected with authentication middleware
- Soft deletes maintain data integrity

## Security Features

- Session-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- SQL injection protection
- Audit trails for all actions

## Getting Started

1. Set up your database and run the schema scripts
2. Create your first admin user manually
3. Configure your environment variables
4. Start the server: `npm start`
5. Login with your admin credentials
6. Use the admin panels to set up your system
