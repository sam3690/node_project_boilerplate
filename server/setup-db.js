const { db } = require('./database/connection');
const { seedDatabase } = require('./database/seeder');

async function runSetup() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Connect to database
    await db.connect();
    console.log('✅ Database connected successfully');

    // Run seeder
    await seedDatabase();
    
    console.log('✅ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

runSetup();
