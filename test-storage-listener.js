// Simple test to verify storage listener works
console.log('Testing AsyncStorage listener functionality...\n');

// Mock AsyncStorage for testing
const mockAsyncStorage = {
  setItem: async (key, value) => {
    console.log(`  Original setItem called: ${key} = ${value}`);
    return Promise.resolve();
  },
  removeItem: async (key) => {
    console.log(`  Original removeItem called: ${key}`);
    return Promise.resolve();
  },
  mergeItem: async (key, value) => {
    console.log(`  Original mergeItem called: ${key} = ${value}`);
    return Promise.resolve();
  },
  clear: async () => {
    console.log(`  Original clear called`);
    return Promise.resolve();
  },
  multiSet: async (pairs) => {
    console.log(`  Original multiSet called with ${pairs.length} pairs`);
    return Promise.resolve();
  },
  multiRemove: async (keys) => {
    console.log(`  Original multiRemove called with ${keys.length} keys`);
    return Promise.resolve();
  }
};

// Create a simple listener implementation
class SimpleStorageListener {
  constructor() {
    this.listeners = [];
    this.originalSetItem = null;
    this.originalRemoveItem = null;
  }

  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  emit(event) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
  }

  startListening(storage) {
    console.log('Starting to listen...');
    
    this.originalSetItem = storage.setItem.bind(storage);
    this.originalRemoveItem = storage.removeItem.bind(storage);
    
    storage.setItem = async (key, value) => {
      console.log(`Intercepted setItem: ${key}`);
      this.emit({
        action: 'setItem',
        timestamp: new Date(),
        data: { key, value }
      });
      return this.originalSetItem(key, value);
    };

    storage.removeItem = async (key) => {
      console.log(`Intercepted removeItem: ${key}`);
      this.emit({
        action: 'removeItem',
        timestamp: new Date(),
        data: { key }
      });
      return this.originalRemoveItem(key);
    };
    
    console.log('Listening started!');
  }

  stopListening(storage) {
    console.log('Stopping listener...');
    if (this.originalSetItem) {
      storage.setItem = this.originalSetItem;
    }
    if (this.originalRemoveItem) {
      storage.removeItem = this.originalRemoveItem;
    }
    console.log('Listener stopped!');
  }
}

// Test the listener
async function test() {
  const listener = new SimpleStorageListener();
  
  // Add event listener
  const unsubscribe = listener.addListener((event) => {
    console.log(`\n📢 Event received:`, event.action, event.data);
  });
  
  // Start listening
  listener.startListening(mockAsyncStorage);
  
  // Test operations
  console.log('\n1. Testing setItem:');
  await mockAsyncStorage.setItem('test_key', 'test_value');
  
  console.log('\n2. Testing removeItem:');
  await mockAsyncStorage.removeItem('test_key');
  
  // Stop listening
  console.log('\n3. Stopping listener:');
  listener.stopListening(mockAsyncStorage);
  
  console.log('\n4. Testing after stop (should not intercept):');
  await mockAsyncStorage.setItem('test_key2', 'test_value2');
  
  // Clean up
  unsubscribe();
  
  console.log('\n✅ Test completed successfully!');
}

test().catch(console.error);
