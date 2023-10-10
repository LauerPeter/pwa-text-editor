

import { openDB } from 'idb';

const DB_NAME = "jate";

const initdb = async () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains(DB_NAME)) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore(DB_NAME, { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });


export const putDb = async (content) => {
  const db = await openDB(DB_NAME, 1);
  const tx = db.transaction(DB_NAME, 'readwrite');
  const store = tx.objectStore(DB_NAME);
  await store.put({ id: 1, value: content });
  await new Promise((resolve) => tx.addEventListener('complete', resolve));
  console.log('🚀 - data saved to the database:', content);
};

export const getDb = async () => {
  const db = await openDB(DB_NAME, 1);
  const tx = db.transaction(DB_NAME, 'readonly');
  const store = tx.objectStore(DB_NAME);
  const request = store.get(1); 
  const result = await new Promise((resolve) => {
    request.addEventListener('success', () => resolve(request.result));
    request.addEventListener('error', () => resolve(null));
  });

  if (result) {
    console.log('🚀 - data retrieved from the database:', result.value);
    return result.value;
  } else {
    console.log('🚀 - data not found in the database.');
    return null;
  }
};

initdb()