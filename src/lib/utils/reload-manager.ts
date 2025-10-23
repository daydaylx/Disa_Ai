export const reloadHelpers = {
  userRequested: () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  },
  serviceWorkerUpdate: (delay: number = 0) => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.reload();
      }, delay);
    }
  },
};
