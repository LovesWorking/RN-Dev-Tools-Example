const fs = require('fs');
const path = require('path');

// Test case sensitivity
const basePath = '/Users/aj/Desktop/rn-dev-tools-example/rn-better-dev-tools/src/features/storage/utils/';
const fileName1 = 'AsyncStorageListener.ts';
const fileName2 = 'asyncStorageListener.ts';

console.log('Testing file case sensitivity...');
console.log('Base path:', basePath);

// Check with correct case
const correctPath = path.join(basePath, fileName1);
console.log('\n1. Testing with AsyncStorageListener.ts:');
console.log('   Path:', correctPath);
console.log('   Exists:', fs.existsSync(correctPath));

// Check with wrong case
const wrongPath = path.join(basePath, fileName2);
console.log('\n2. Testing with asyncStorageListener.ts:');
console.log('   Path:', wrongPath);
console.log('   Exists:', fs.existsSync(wrongPath));

// List actual files
console.log('\n3. Actual files in directory:');
const files = fs.readdirSync(basePath);
files.forEach(file => {
  if (file.toLowerCase().includes('async')) {
    console.log('   -', file);
  }
});

// Check if macOS is case insensitive
console.log('\n4. File system case sensitivity test:');
const testFile1 = '/tmp/TestCase.txt';
const testFile2 = '/tmp/testcase.txt';
fs.writeFileSync(testFile1, 'test');
const canAccessWithWrongCase = fs.existsSync(testFile2);
console.log('   File system is:', canAccessWithWrongCase ? 'CASE INSENSITIVE' : 'CASE SENSITIVE');
fs.unlinkSync(testFile1);
