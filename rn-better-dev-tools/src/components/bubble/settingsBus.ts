type Listener<T> = (payload: T) => void;

class SimpleEventBus<T = any> {
  private listeners: Set<Listener<T>> = new Set();

  emit(payload: T) {
    this.listeners.forEach((l) => {
      try {
        l(payload);
      } catch (_e) {
        // no-op - @typescript-eslint/no-unused-vars
      }
    });
  }

  addListener(listener: Listener<T>) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const settingsBus = new SimpleEventBus<any>();
