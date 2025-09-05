// Test if the storage listener can be imported
const path = require('path');

console.log('Testing AsyncStorageListener import...');

try {
  const listenerPath = path.resolve(__dirname, 'rn-better-dev-tools/src/features/storage/utils/AsyncStorageListener.ts');
  console.log('File path:', listenerPath);
  
  const fs = require('fs');
  if (fs.existsSync(listenerPath)) {
    console.log('✓ File exists');
    
    // Check file content
    const content = fs.readFileSync(listenerPath, 'utf-8');
    
    // Check exports
    const hasStartListening = content.includes('export const startListening');
    const hasStopListening = content.includes('export const stopListening');
    const hasAddListener = content.includes('export const addListener');
    
    console.log('Export checks:');
    console.log('  startListening:', hasStartListening ? '✓' : '✗');
    console.log('  stopListening:', hasStopListening ? '✓' : '✗');
    console.log('  addListener:', hasAddListener ? '✓' : '✗');
    
    // Check class definition
    const hasClass = content.includes('class AsyncStorageListener');
    console.log('  AsyncStorageListener class:', hasClass ? '✓' : '✗');
    
    // Check singleton
    const hasSingleton = content.includes('const asyncStorageListener = new AsyncStorageListener()');
    console.log('  Singleton instance:', hasSingleton ? '✓' : '✗');
    
  } else {
    console.log('✗ File does not exist');
  }
} catch (error) {
  console.error('Error:', error.message);
}
