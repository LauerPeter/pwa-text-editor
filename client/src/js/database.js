

import { openDB } from 'idb';

const DB_NAME = "jate";

const initdb = async () => {
  const db = await openDB(DB_NAME, 1);
  if (db.objectStoreNames.contains(DB_NAME)) {
    console.log('jate database already exists');
  } else {
    db.createObjectStore(DB_NAME, { keyPath: 'id', autoIncrement: true });
    console.log('jate database created');
  }
};

export const putDb = async (content) => {
  const db = await openDB(DB_NAME, 1);
  const tx = db.transaction(DB_NAME, 'readwrite');
  const store = tx.objectStore(DB_NAME);
  await store.put({ id: 1, value: content });
  await tx.done;
  console.log('🚀 - data saved to the database:', content);
};

export const getDb = async () => {
  const db = await openDB(DB_NAME, 1);
  const tx = db.transaction(DB_NAME, 'readonly');
  const store = tx.objectStore(DB_NAME);
  const result = await store.get(1);
  
  if (result) {
    console.log('🚀 - data retrieved from the database:', result.value);
    return result.value;
  } else {
    console.log('🚀 - data not found in the database.');
    return null;
  }
};

initdb();
