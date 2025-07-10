// Simple verification script to test imports
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔍 Verifying React + Vite + Tailwind setup...\n');

// Check if all key files exist
const requiredFiles = [
  'src/main.jsx',
  'src/App.jsx',
  'src/index.css',
  'src/App.css',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'eslint.config.js',
  'index.html'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('❌ Missing files:', missingFiles);
  process.exit(1);
} else {
  console.log('✅ All required files present');
}

// Check package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const hasVite = pkg.devDependencies?.vite;
const hasReact = pkg.dependencies?.react;
const hasTailwind = pkg.devDependencies?.tailwindcss;

console.log(`✅ Vite: ${hasVite}`);
console.log(`✅ React: ${hasReact}`);
console.log(`✅ Tailwind: ${hasTailwind}`);

// Test build
try {
  console.log('\n🔨 Testing build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build successful');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 All checks passed! Your React + Vite + Tailwind setup is ready.');
console.log('\nTo start development:');
console.log('  npm run dev');
console.log('\nTo build for production:');
console.log('  npm run build');
