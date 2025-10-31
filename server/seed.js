const { seedDatabase } = require('./database/seeder');
const { db } = require('./database/connection');

async function runSeeder() {
  try {
    console.log('Connecting to database...');
    await db.connect();
    
    console.log('Running database seeder...');
    // await seedDatabase();
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

runSeeder();
