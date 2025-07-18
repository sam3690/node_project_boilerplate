-- Create Groups table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Groups' AND xtype='U')
BEGIN
    CREATE TABLE Groups (
        idGroup INT IDENTITY(1,1) PRIMARY KEY,
        groupName VARCHAR(50),
        createdBy VARCHAR(50),
        createdDateTime DATETIME DEFAULT GETDATE(),
        updateBy VARCHAR(50),
        updatedDateTime DATETIME,
        deleteBy VARCHAR(50),
        deletedDateTime DATETIME,
        isActive BIT DEFAULT 1
    );
    
    -- Create indexes
    CREATE INDEX IX_Groups_GroupName ON Groups(groupName);
    CREATE INDEX IX_Groups_IsActive ON Groups(isActive);
    
    PRINT 'Groups table created successfully';
END
ELSE
BEGIN
    PRINT 'Groups table already exists';
END

-- Create Pages table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Pages' AND xtype='U')
BEGIN
    CREATE TABLE Pages (
        idPages INT IDENTITY(1,1) PRIMARY KEY,
        pageName VARCHAR(50),
        pageUrl VARCHAR(50),
        isParent BIT DEFAULT 0,
        idParent VARCHAR(5) DEFAULT '0',
        menuIcon VARCHAR(20),
        menuClass VARCHAR(20),
        isMenu BIT DEFAULT 1,
        isTitle INT DEFAULT 0,
        titlePara VARCHAR(10),
        sort_no INT DEFAULT 1,
        isActive BIT DEFAULT 1,
        createdBy VARCHAR(50),
        createdDateTime DATETIME DEFAULT GETDATE(),
        updateBy VARCHAR(50),
        updatedDateTime DATETIME,
        deleteBy VARCHAR(50),
        deletedDateTime DATETIME,
        langName VARCHAR(50) DEFAULT 'en'
    );
    
    -- Create indexes
    CREATE INDEX IX_Pages_PageName ON Pages(pageName);
    CREATE INDEX IX_Pages_IsActive ON Pages(isActive);
    CREATE INDEX IX_Pages_SortNo ON Pages(sort_no);
    CREATE INDEX IX_Pages_IsParent ON Pages(isParent);
    
    PRINT 'Pages table created successfully';
END
ELSE
BEGIN
    PRINT 'Pages table already exists';
END

-- Create PageGroup table (permissions)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PageGroup' AND xtype='U')
BEGIN
    CREATE TABLE PageGroup (
        idPageGroup INT IDENTITY(1,1) PRIMARY KEY,
        idGroup INT,
        idPages INT,
        CanAdd BIT DEFAULT 0,
        CanEdit BIT DEFAULT 0,
        CanDelete BIT DEFAULT 0,
        CanView BIT DEFAULT 0,
        CanViewAllDetail BIT DEFAULT 0,
        isActive BIT DEFAULT 1,
        FOREIGN KEY (idGroup) REFERENCES Groups(idGroup),
        FOREIGN KEY (idPages) REFERENCES Pages(idPages)
    );
    
    -- Create indexes
    CREATE INDEX IX_PageGroup_IdGroup ON PageGroup(idGroup);
    CREATE INDEX IX_PageGroup_IdPages ON PageGroup(idPages);
    CREATE INDEX IX_PageGroup_IsActive ON PageGroup(isActive);
    
    PRINT 'PageGroup table created successfully';
END
ELSE
BEGIN
    PRINT 'PageGroup table already exists';
END

-- Update users_dash table to use foreign key reference to Groups
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_UsersDash_Groups')
BEGIN
    ALTER TABLE users_dash
    ADD CONSTRAINT FK_UsersDash_Groups
    FOREIGN KEY (idGroup) REFERENCES Groups(idGroup);
    
    PRINT 'Foreign key constraint added to users_dash table';
END
ELSE
BEGIN
    PRINT 'Foreign key constraint already exists';
END
