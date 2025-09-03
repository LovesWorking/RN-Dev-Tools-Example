export default function cn(...args: any[]): string {
  const classes: string[] = [];
  
  for (const arg of args) {
    if (!arg) continue;
    
    const argType = typeof arg;
    
    if (argType === 'string' || argType === 'number') {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      const inner = cn(...arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (argType === 'object') {
      for (const key in arg) {
        if (arg[key]) {
          classes.push(key);
        }
      }
    }
  }
  
  return classes.join(' ');
}