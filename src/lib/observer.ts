export function createObserverManager<T>() {
  let observers: Array<(data: T) => void> = [];

  function subscribe(callback: (data: T) => void): () => void {
    observers.push(callback);

    return () => {
      const index = observers.indexOf(callback);
      if (index > -1) {
        observers.splice(index, 1);
      }
    };
  }

  function notify(data: T): void {
    observers.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error("Error in observer:", error);
      }
    });
  }

  function destroy(): void {
    observers = [];
  }

  return { subscribe, notify, destroy };
}
