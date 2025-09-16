#!/usr/bin/env node

/**
 * Validate imports in package source files
 * Ensures packages don't have forbidden dependencies
 */

const fs = require('fs');
const path = require('path');

// Forbidden import patterns that should not be in packages
const FORBIDDEN_PATTERNS = [
  // No absolute imports from app
  /from\s+['"]@\//,
  /import\s+['"]@\//,
  
  // No imports from rn-better-dev-tools
  /from\s+['"].*rn-better-dev-tools/,
  /import\s+['"].*rn-better-dev-tools/,
  
  // No imports from app directory
  /from\s+['"].*\/app\//,
  /import\s+['"].*\/app\//,
  
  // No imports from other local packages (cross-package dependencies)
  /from\s+['"]@rn-dev-tools\/(?!react-native-network-inspector|react-native-env-manager)/,
];

// Allowed import patterns (whitelist)
const ALLOWED_PATTERNS = [
  // React and React Native
  /^import.*from\s+['"]react['"]/,
  /^import.*from\s+['"]react-native['"]/,
  
  // Relative imports within the package
  /from\s+['"]\.\.?\//,
  
  // Node built-ins (for build scripts only)
  /from\s+['"]fs['"]/,
  /from\s+['"]path['"]/,
  /from\s+['"]util['"]/,
];

// Packages to validate
const PACKAGES_TO_VALIDATE = [
  'react-native-network-inspector',
  'react-native-env-manager'
];

function getFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and build directories
      if (item === 'node_modules' || item === 'lib' || item === 'dist' || item === 'build') {
        continue;
      }
      getFiles(fullPath, files);
    } else if (stat.isFile()) {
      // Only check TypeScript/JavaScript files
      if (fullPath.match(/\.(ts|tsx|js|jsx)$/)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const errors = [];
  
  lines.forEach((line, index) => {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      return;
    }
    
    // Check for forbidden patterns
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(line)) {
        errors.push({
          file: filePath,
          line: index + 1,
          content: line.trim(),
          pattern: pattern.toString()
        });
      }
    }
  });
  
  return errors;
}

function validatePackage(packageName) {
  const packagePath = path.join(__dirname, '..', 'packages', packageName);
  
  if (!fs.existsSync(packagePath)) {
    console.log(`⚠️  Package not found: ${packageName}`);
    return [];
  }
  
  const srcPath = path.join(packagePath, 'src');
  if (!fs.existsSync(srcPath)) {
    console.log(`⚠️  No src directory in package: ${packageName}`);
    return [];
  }
  
  const files = getFiles(srcPath);
  const allErrors = [];
  
  console.log(`\n📦 Validating package: ${packageName}`);
  console.log(`   Checking ${files.length} files...`);
  
  for (const file of files) {
    const errors = validateFile(file);
    allErrors.push(...errors);
  }
  
  if (allErrors.length === 0) {
    console.log(`   ✅ All imports are clean!`);
  } else {
    console.log(`   ❌ Found ${allErrors.length} forbidden import(s)`);
  }
  
  return allErrors;
}

function main() {
  console.log('🔍 Validating package imports...');
  console.log('================================');
  
  let totalErrors = 0;
  const errorsByPackage = {};
  
  for (const packageName of PACKAGES_TO_VALIDATE) {
    const errors = validatePackage(packageName);
    errorsByPackage[packageName] = errors;
    totalErrors += errors.length;
  }
  
  // Print detailed error report
  if (totalErrors > 0) {
    console.log('\n❌ Forbidden Import Report');
    console.log('==========================');
    
    for (const [packageName, errors] of Object.entries(errorsByPackage)) {
      if (errors.length > 0) {
        console.log(`\n📦 ${packageName}:`);
        for (const error of errors) {
          const relativePath = path.relative(process.cwd(), error.file);
          console.log(`   ${relativePath}:${error.line}`);
          console.log(`      ${error.content}`);
          console.log(`      Pattern: ${error.pattern}`);
        }
      }
    }
    
    console.log('\n❌ Validation failed!');
    console.log(`Found ${totalErrors} forbidden import(s) across all packages.`);
    console.log('\nPackages should only import from:');
    console.log('  - react');
    console.log('  - react-native');
    console.log('  - relative paths within the same package');
    process.exit(1);
  } else {
    console.log('\n✅ All packages have clean imports!');
    console.log('No forbidden dependencies found.');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateFile, validatePackage, FORBIDDEN_PATTERNS };