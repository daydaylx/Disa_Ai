export const reloadHelpers = {
  userRequested: () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  },
};