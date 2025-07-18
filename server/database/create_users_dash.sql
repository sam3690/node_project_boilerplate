-- Create users_dash table (the table actually used by the application)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users_dash' AND xtype='U')
BEGIN
    CREATE TABLE users_dash (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        username NVARCHAR(50) NOT NULL UNIQUE,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        designation NVARCHAR(100),
        contact NVARCHAR(20),
        district NVARCHAR(100),
        idGroup NVARCHAR(50),
        status BIT DEFAULT 1,
        attempt INT DEFAULT 0,
        attemptDateTime DATETIME2 NULL,
        createdBy NVARCHAR(50) DEFAULT 'system',
        created_at DATETIME2 DEFAULT GETDATE(),
        updateBy NVARCHAR(50),
        updated_at DATETIME2 DEFAULT GETDATE(),
        lastPwdChangeBy NVARCHAR(50),
        lastPwd_dt DATETIME2 NULL,
        isNewUser BIT DEFAULT 1
    );
    
    -- Create indexes for better performance
    CREATE INDEX IX_users_dash_Email ON users_dash(email);
    CREATE INDEX IX_users_dash_Username ON users_dash(username);
    CREATE INDEX IX_users_dash_Status ON users_dash(status);
    
    PRINT 'users_dash table created successfully';
END
ELSE
BEGIN
    PRINT 'users_dash table already exists';
END
