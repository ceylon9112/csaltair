/**
 * Browser stand-in for @react-native-async-storage/async-storage so shared Zustand stores work in Vite.
 */
const memory = new Map<string, string>();

const storage = {
  getItem: (key: string) =>
    Promise.resolve(typeof localStorage !== 'undefined' ? localStorage.getItem(key) : memory.get(key) ?? null),
  setItem: (key: string, value: string) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      memory.set(key, value);
    }
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      memory.delete(key);
    }
    return Promise.resolve();
  },
};

export default storage;
