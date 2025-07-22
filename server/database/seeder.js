const db = require('./connection');

// Default groups
const defaultGroups = [
  { groupName: 'superadmin', createdBy: 'system' },
  { groupName: 'supervisor', createdBy: 'system' },
  { groupName: 'user', createdBy: 'system' }
];

// Default pages
const defaultPages = [
  {
    pageName: 'Dashboard',
    pageUrl: '/dashboard',
    isParent: 0,
    idParent: '0',
    menuIcon: 'fas fa-tachometer-alt',
    menuClass: 'nav-item',
    isMenu: 1,
    isTitle: 0,
    titlePara: '',
    sort_no: 1,
    isActive: 1,
    langName: 'en',
    createdBy: 'system'
  },
  {
    pageName: 'Users',
    pageUrl: '/users',
    isParent: 0,
    idParent: '0',
    menuIcon: 'fas fa-users',
    menuClass: 'nav-item',
    isMenu: 1,
    isTitle: 0,
    titlePara: '',
    sort_no: 2,
    isActive: 1,
    langName: 'en',
    createdBy: 'system'
  },
  {
    pageName: 'Groups',
    pageUrl: '/groups',
    isParent: 0,
    idParent: '0',
    menuIcon: 'fas fa-layer-group',
    menuClass: 'nav-item',
    isMenu: 1,
    isTitle: 0,
    titlePara: '',
    sort_no: 3,
    isActive: 1,
    langName: 'en',
    createdBy: 'system'
  },
  {
    pageName: 'Pages',
    pageUrl: '/pages',
    isParent: 0,
    idParent: '0',
    menuIcon: 'fas fa-file-alt',
    menuClass: 'nav-item',
    isMenu: 1,
    isTitle: 0,
    titlePara: '',
    sort_no: 4,
    isActive: 1,
    langName: 'en',
    createdBy: 'system'
  },
  {
    pageName: 'Permissions',
    pageUrl: '/permissions',
    isParent: 0,
    idParent: '0',
    menuIcon: 'fas fa-shield-alt',
    menuClass: 'nav-item',
    isMenu: 1,
    isTitle: 0,
    titlePara: '',
    sort_no: 5,
    isActive: 1,
    langName: 'en',
    createdBy: 'system'
  },
  {
    pageName: 'Profile',
    pageUrl: '/profile',
    isParent: 0,
    idParent: '0',
    menuIcon: 'fas fa-user',
    menuClass: 'nav-item',
    isMenu: 1,
    isTitle: 0,
    titlePara: '',
    sort_no: 6,
    isActive: 1,
    langName: 'en',
    createdBy: 'system'
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed Groups
    console.log('Seeding groups...');
    for (const group of defaultGroups) {
      // Check if group already exists
      const existingGroup = await db.query(
        'SELECT * FROM Groups WHERE groupName = @groupName AND deletedDateTime IS NULL',
        { groupName: group.groupName }
      );

      if (existingGroup.recordset.length === 0) {
        await db.query(
          `INSERT INTO Groups (groupName, createdBy, createdDateTime, isActive) 
           VALUES (@groupName, @createdBy, GETDATE(), 1)`,
          group
        );
        console.log(`✅ Group '${group.groupName}' created`);
      } else {
        console.log(`ℹ️  Group '${group.groupName}' already exists`);
      }
    }

    // Seed Pages
    console.log('Seeding pages...');
    for (const page of defaultPages) {
      // Check if page already exists
      const existingPage = await db.query(
        'SELECT * FROM Pages WHERE pageUrl = @pageUrl AND deletedDateTime IS NULL',
        { pageUrl: page.pageUrl }
      );

      if (existingPage.recordset.length === 0) {
        await db.query(
          `INSERT INTO Pages (
            pageName, pageUrl, isParent, idParent, menuIcon, menuClass,
            isMenu, isTitle, titlePara, sort_no, isActive, langName,
            createdBy, createdDateTime
          ) VALUES (
            @pageName, @pageUrl, @isParent, @idParent, @menuIcon, @menuClass,
            @isMenu, @isTitle, @titlePara, @sort_no, @isActive, @langName,
            @createdBy, GETDATE()
          )`,
          page
        );
        console.log(`✅ Page '${page.pageName}' created`);
      } else {
        console.log(`ℹ️  Page '${page.pageName}' already exists`);
      }
    }

    // Set superadmin permissions (full access to all pages)
    console.log('Setting superadmin permissions...');
    const superadminGroup = await db.query(
      'SELECT idGroup FROM Groups WHERE groupName = @groupName AND deletedDateTime IS NULL',
      { groupName: 'superadmin' }
    );

    const pages = await db.query(
      'SELECT idPages FROM Pages WHERE deletedDateTime IS NULL'
    );

    if (superadminGroup.recordset.length > 0 && pages.recordset.length > 0) {
      const superadminId = superadminGroup.recordset[0].idGroup;

      for (const page of pages.recordset) {
        // Check if permission already exists
        const existingPermission = await db.query(
          'SELECT * FROM PageGroup WHERE idGroup = @idGroup AND idPages = @idPages',
          { idGroup: superadminId, idPages: page.idPages }
        );

        if (existingPermission.recordset.length === 0) {
          await db.query(
            `INSERT INTO PageGroup (idGroup, idPages, CanAdd, CanEdit, CanDelete, CanView, CanViewAllDetail, isActive)
             VALUES (@idGroup, @idPages, 1, 1, 1, 1, 1, 1)`,
            { idGroup: superadminId, idPages: page.idPages }
          );
        }
      }
      console.log('✅ Superadmin permissions set');
    }

    // Set supervisor permissions (view and edit access, no delete)
    console.log('Setting supervisor permissions...');
    const supervisorGroup = await db.query(
      'SELECT idGroup FROM Groups WHERE groupName = @groupName AND deletedDateTime IS NULL',
      { groupName: 'supervisor' }
    );

    if (supervisorGroup.recordset.length > 0) {
      const supervisorId = supervisorGroup.recordset[0].idGroup;

      for (const page of pages.recordset) {
        // Check if permission already exists
        const existingPermission = await db.query(
          'SELECT * FROM PageGroup WHERE idGroup = @idGroup AND idPages = @idPages',
          { idGroup: supervisorId, idPages: page.idPages }
        );

        if (existingPermission.recordset.length === 0) {
          await db.query(
            `INSERT INTO PageGroup (idGroup, idPages, CanAdd, CanEdit, CanDelete, CanView, CanViewAllDetail, isActive)
             VALUES (@idGroup, @idPages, 1, 1, 0, 1, 1, 1)`,
            { idGroup: supervisorId, idPages: page.idPages }
          );
        }
      }
      console.log('✅ Supervisor permissions set');
    }

    // Set user permissions (view access only)
    console.log('Setting user permissions...');
    const userGroup = await db.query(
      'SELECT idGroup FROM Groups WHERE groupName = @groupName AND deletedDateTime IS NULL',
      { groupName: 'user' }
    );

    if (userGroup.recordset.length > 0) {
      const userId = userGroup.recordset[0].idGroup;

      for (const page of pages.recordset) {
        // Check if permission already exists
        const existingPermission = await db.query(
          'SELECT * FROM PageGroup WHERE idGroup = @idGroup AND idPages = @idPages',
          { idGroup: userId, idPages: page.idPages }
        );

        if (existingPermission.recordset.length === 0) {
          await db.query(
            `INSERT INTO PageGroup (idGroup, idPages, CanAdd, CanEdit, CanDelete, CanView, CanViewAllDetail, isActive)
             VALUES (@idGroup, @idPages, 0, 0, 0, 1, 0, 1)`,
            { idGroup: userId, idPages: page.idPages }
          );
        }
      }
      console.log('✅ User permissions set');
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

module.exports = { seedDatabase };
