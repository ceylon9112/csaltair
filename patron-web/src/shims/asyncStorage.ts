/**
 * Browser stand-in for @react-native-async-storage/async-storage so shared Zustand stores work in Vite.
 * localStorage can throw (Safari private mode, strict tracking protection, quota). Never throw — use memory fallback.
 */
const memory = new Map<string, string>();

function lsGet(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {
    /* ignore */
  }
  return memory.get(key) ?? null;
}

function lsSet(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
  } catch {
    /* fall through */
  }
  memory.set(key, value);
}

function lsRemove(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return;
    }
  } catch {
    /* fall through */
  }
  memory.delete(key);
}

const storage = {
  getItem: (key: string) => Promise.resolve(lsGet(key)),
  setItem: (key: string, value: string) => {
    lsSet(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    lsRemove(key);
    return Promise.resolve();
  },
};

export default storage;
