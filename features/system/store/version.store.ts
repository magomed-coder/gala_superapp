export const useAppVersionStore = () => {
  return {
    // Stub: check for updates, e.g. call version API
    checkForUpdate: async () => {
      // no-op for now; extend to call update API
      return Promise.resolve();
    },
    // Stub: return whether app must force update
    needsForceUpdate: () => false,
  };
};

export default useAppVersionStore;
