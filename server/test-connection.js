const db = require('./database/connection');

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const pool = await db.connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await db.query('SELECT @@VERSION as version, GETDATE() as currentTime');
    console.log('✅ Query test successful!');
    console.log('SQL Server Version:', result.recordset[0].version.substring(0, 50) + '...');
    console.log('Current Time:', result.recordset[0].currentTime);
    
    // Test if our target database exists
    const dbCheck = await db.query('SELECT name FROM sys.databases WHERE name = @dbName', { 
      dbName: process.env.DB_DATABASE || 'CASI_GM_AFG' 
    });
    
    if (dbCheck.recordset.length > 0) {
      console.log('✅ Target database exists:', dbCheck.recordset[0].name);
    } else {
      console.log('⚠️  Target database not found. You may need to create it first.');
    }
    
    console.log('🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    
    if (error.message.includes('Login failed')) {
      console.log('\n💡 Authentication issue detected:');
      console.log('- Check if SQL Server Authentication is enabled');
      console.log('- Verify username and password are correct');
      console.log('- Make sure the user has access to the database');
    }
    
    if (error.message.includes('Cannot open database')) {
      console.log('\n💡 Database access issue:');
      console.log('- The database might not exist');
      console.log('- The user might not have permission to access this database');
      console.log('- Try connecting to master database first');
    }
  }
}

testDatabaseConnection();
