-- Create Users table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL UNIQUE,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        first_name NVARCHAR(50),
        last_name NVARCHAR(50),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        last_login DATETIME2 NULL
    );
    
    -- Create indexes for better performance
    CREATE INDEX IX_Users_Email ON Users(email);
    CREATE INDEX IX_Users_Username ON Users(username);
    
    PRINT 'Users table created successfully';
END
ELSE
BEGIN
    PRINT 'Users table already exists';
END

-- Create UserSessions table for token management (optional for JWT blacklisting)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserSessions' AND xtype='U')
BEGIN
    CREATE TABLE UserSessions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        token_hash NVARCHAR(255) NOT NULL,
        expires_at DATETIME2 NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        is_revoked BIT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );
    
    -- Create indexes
    CREATE INDEX IX_UserSessions_UserId ON UserSessions(user_id);
    CREATE INDEX IX_UserSessions_TokenHash ON UserSessions(token_hash);
    CREATE INDEX IX_UserSessions_ExpiresAt ON UserSessions(expires_at);
    
    PRINT 'UserSessions table created successfully';
END
ELSE
BEGIN
    PRINT 'UserSessions table already exists';
END

-- Create trigger to update updated_at timestamp
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_Users_UpdateTimestamp')
BEGIN
    EXEC('
    CREATE TRIGGER TR_Users_UpdateTimestamp
    ON Users
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE Users 
        SET updated_at = GETDATE()
        FROM Users u
        INNER JOIN inserted i ON u.id = i.id;
    END
    ');
    
    PRINT 'Users update timestamp trigger created successfully';
END
ELSE
BEGIN
    PRINT 'Users update timestamp trigger already exists';
END

-- Insert sample admin user (password: admin123 - hashed with bcrypt)
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'admin')
BEGIN
    INSERT INTO Users (username, email, password_hash, first_name, last_name)
    VALUES (
        'admin',
        'admin@example.com',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
        'Admin',
        'User'
    );
    
    PRINT 'Sample admin user created successfully (username: admin, password: admin123)';
END
ELSE
BEGIN
    PRINT 'Admin user already exists';
END

PRINT 'Database schema setup completed successfully!';
