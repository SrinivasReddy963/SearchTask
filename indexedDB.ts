import { openDB } from 'idb';

const DB_NAME = 'wilyaSearchDB';
const STORE_NAME = 'searchStore';

export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'name' });
      }
    },
  });
  return db;
};

export const saveSearch = async (name: string) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const existing = await store.get(name);
  if (existing) {
    store.put({ name, count: existing.count + 1 });
  } else {
    store.add({ name, count: 1 });
  }
  await tx.done;
};

export const getSearches = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const allItems = await store.getAll();
  await tx.done;
  return allItems;
};
