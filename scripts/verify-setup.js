#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying SeraphineHybridV1.5 Development Environment...\n');

// Check if essential files exist
const essentialFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  '.eslintrc.json',
  '.prettierrc.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/styles/globals.css',
];

let allFilesExist = true;

essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check if node_modules exists
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules (dependencies installed)');
} else {
  console.log('❌ node_modules - MISSING (run npm install)');
  allFilesExist = false;
}

// Check if public assets are accessible
const publicAssets = [
  'public/assets/splash/logo.svg',
  'public/assets/splash/SeraphineAvatar.png',
  'public/assets/terms/AdminIcon.svg',
];

console.log('\n🎨 Checking public assets...');
publicAssets.forEach(asset => {
  if (fs.existsSync(asset)) {
    console.log(`✅ ${asset}`);
  } else {
    console.log(`❌ ${asset} - MISSING`);
  }
});

console.log('\n📦 Package.json dependencies check...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
  'next',
  'react',
  'react-dom',
  'typescript',
  'tailwindcss',
  'framer-motion',
];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n🎯 Summary:');
if (allFilesExist) {
  console.log('✅ All essential files and dependencies are present!');
  console.log('🚀 Ready to start development with: npm run dev');
} else {
  console.log(
    '❌ Some files or dependencies are missing. Please review the setup.'
  );
}

console.log('\n📋 Available scripts:');
Object.keys(packageJson.scripts || {}).forEach(script => {
  console.log(`   npm run ${script}`);
});
