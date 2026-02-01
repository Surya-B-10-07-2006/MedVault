#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 MedVault Deployment Validation\n');

const checks = [];

// Check if required files exist
const requiredFiles = [
  'package.json',
  'backend/package.json',
  'frontend/package.json',
  'backend/server.js',
  'frontend/src/App.jsx',
  'render.yaml',
  'vercel.json',
  'netlify.toml',
  'Dockerfile',
  'docker-compose.yml'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  checks.push({
    name: `File: ${file}`,
    status: exists ? 'PASS' : 'FAIL',
    message: exists ? 'Found' : 'Missing required file'
  });
});

// Check package.json scripts
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const requiredScripts = ['build:all', 'deploy:netlify', 'deploy:vercel', 'docker:build'];
  
  requiredScripts.forEach(script => {
    const exists = pkg.scripts && pkg.scripts[script];
    checks.push({
      name: `Script: ${script}`,
      status: exists ? 'PASS' : 'FAIL',
      message: exists ? 'Configured' : 'Missing deployment script'
    });
  });
} catch (e) {
  checks.push({
    name: 'Package.json validation',
    status: 'FAIL',
    message: 'Cannot read package.json'
  });
}

// Check environment example
try {
  const envExample = fs.readFileSync(path.join(__dirname, 'backend/.env.example'), 'utf8');
  const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'REFRESH_SECRET'];
  
  requiredVars.forEach(varName => {
    const exists = envExample.includes(varName);
    checks.push({
      name: `Env var: ${varName}`,
      status: exists ? 'PASS' : 'FAIL',
      message: exists ? 'Documented' : 'Missing from .env.example'
    });
  });
} catch (e) {
  checks.push({
    name: 'Environment example',
    status: 'FAIL',
    message: 'Cannot read .env.example'
  });
}

// Check frontend build configuration
try {
  const viteConfig = fs.readFileSync(path.join(__dirname, 'frontend/vite.config.js'), 'utf8');
  const hasProxy = viteConfig.includes('proxy');
  const hasBuild = viteConfig.includes('build');
  
  checks.push({
    name: 'Vite proxy config',
    status: hasProxy ? 'PASS' : 'WARN',
    message: hasProxy ? 'Configured' : 'No proxy configuration'
  });
  
  checks.push({
    name: 'Vite build config',
    status: hasBuild ? 'PASS' : 'WARN',
    message: hasBuild ? 'Configured' : 'Using default build config'
  });
} catch (e) {
  checks.push({
    name: 'Vite configuration',
    status: 'FAIL',
    message: 'Cannot read vite.config.js'
  });
}

// Display results
console.log('📋 Validation Results:\n');

let passCount = 0;
let failCount = 0;
let warnCount = 0;

checks.forEach(check => {
  const icon = check.status === 'PASS' ? '✅' : check.status === 'WARN' ? '⚠️' : '❌';
  console.log(`${icon} ${check.name}: ${check.message}`);
  
  if (check.status === 'PASS') passCount++;
  else if (check.status === 'FAIL') failCount++;
  else warnCount++;
});

console.log(`\n📊 Summary: ${passCount} passed, ${warnCount} warnings, ${failCount} failed\n`);

if (failCount === 0) {
  console.log('🎉 All critical checks passed! Ready for deployment.\n');
  
  console.log('🚀 Quick Deploy Commands:');
  console.log('  npm run deploy:netlify    # Deploy to Netlify');
  console.log('  npm run deploy:vercel     # Deploy to Vercel');
  console.log('  npm run deploy:render     # Deploy to Render');
  console.log('  npm run docker:run        # Run with Docker\n');
  
  console.log('📚 Next Steps:');
  console.log('  1. Set up MongoDB Atlas database');
  console.log('  2. Configure environment variables');
  console.log('  3. Choose deployment platform');
  console.log('  4. Run deployment command');
  console.log('  5. Test deployed application\n');
} else {
  console.log('⚠️  Please fix the failed checks before deploying.\n');
  process.exit(1);
}

console.log('📖 For detailed deployment instructions, see DEPLOYMENT_COMPLETE.md');