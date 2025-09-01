export interface DiffItem {
  type: "CREATE" | "REMOVE" | "CHANGE";
  path: (string | number)[];
  value?: any;
  oldValue?: any;
}

function isObject(obj: any): obj is Record<string, any> {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

function isArray(obj: any): obj is any[] {
  return Array.isArray(obj);
}

function compareValues(oldVal: any, newVal: any, path: (string | number)[], diffs: DiffItem[]) {
  // Both are objects
  if (isObject(oldVal) && isObject(newVal)) {
    const allKeys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);
    
    for (const key of allKeys) {
      const newPath = [...path, key];
      
      if (!(key in oldVal)) {
        // Key was added
        diffs.push({
          type: "CREATE",
          path: newPath,
          value: newVal[key]
        });
      } else if (!(key in newVal)) {
        // Key was removed
        diffs.push({
          type: "REMOVE",
          path: newPath,
          oldValue: oldVal[key]
        });
      } else {
        // Key exists in both, compare values
        compareValues(oldVal[key], newVal[key], newPath, diffs);
      }
    }
  }
  // Both are arrays
  else if (isArray(oldVal) && isArray(newVal)) {
    const maxLength = Math.max(oldVal.length, newVal.length);
    
    for (let i = 0; i < maxLength; i++) {
      const newPath = [...path, i];
      
      if (i >= oldVal.length) {
        // Item was added
        diffs.push({
          type: "CREATE",
          path: newPath,
          value: newVal[i]
        });
      } else if (i >= newVal.length) {
        // Item was removed
        diffs.push({
          type: "REMOVE",
          path: newPath,
          oldValue: oldVal[i]
        });
      } else {
        // Item exists in both, compare values
        compareValues(oldVal[i], newVal[i], newPath, diffs);
      }
    }
  }
  // Values are different types or primitives
  else if (oldVal !== newVal) {
    diffs.push({
      type: "CHANGE",
      path,
      oldValue: oldVal,
      value: newVal
    });
  }
}

export function objectDiff(oldObj: any, newObj: any): DiffItem[] {
  const diffs: DiffItem[] = [];
  
  // Handle null/undefined cases
  if (oldObj === newObj) {
    return diffs;
  }
  
  if (oldObj === null || oldObj === undefined) {
    if (newObj !== null && newObj !== undefined) {
      diffs.push({
        type: "CREATE",
        path: [],
        value: newObj
      });
    }
    return diffs;
  }
  
  if (newObj === null || newObj === undefined) {
    diffs.push({
      type: "REMOVE",
      path: [],
      oldValue: oldObj
    });
    return diffs;
  }
  
  compareValues(oldObj, newObj, [], diffs);
  
  return diffs;
}