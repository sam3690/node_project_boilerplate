# Login Test Credentials

## For Testing the Role-Based Authentication System

The authentication system now uses role-based access with the complete database structure.

### Super Admin Credentials:
- **Email:** `test@example.com`
- **Username:** `admin`
- **Password:** `test123`
- **Designation:** `superadmin` (has access to all admin features)

This user has full access to:
- **Manage Users** - Add, edit, delete users
- **Manage Groups** - Configure user groups and roles  
- **Manage Pages** - Set up navigation and page structure

### Admin Panel Access:
Only users with `designation = 'superadmin'` can access:
- `/admin/users` - User management interface
- `/admin/groups` - Group management interface  
- `/admin/pages` - Page management interface

### Database Tables:
- **users_dash** - User accounts with group assignments
- **Groups** - User groups/roles (superadmin = idGroup 1)
- **Pages** - Navigation structure with parent/child relationships
- **PageGroup** - Permission matrix (which groups can access which pages)

### Testing Scenarios:

1. **Successful Admin Login:**
   - Use superadmin credentials above
   - Should see admin navigation options in dashboard
   - Can access all admin management pages

2. **Failed Login:**
   - Use any other email/password combination
   - Should show error message without page reload

3. **Access Control:**
   - Only superadmin designation can access admin pages
   - Other users will see "Access denied" message

### Note:
The system now uses complete role-based authentication with proper database relationships and soft deletes for data integrity.
