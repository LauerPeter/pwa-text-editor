

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
  // First, create a variable, and set it to asynchronously await the opening of the database.
  const db = await openDB(DB_NAME, 1);
  // Now create a transaction for read-write access.
  const tx = db.transaction(DB_NAME, 'readwrite');
  // Create a variable for the object store.
  const store = tx.objectStore(DB_NAME);
  await store.put({ id: 1, value: content });
  // wait for transaction to complete
  await new Promise((resolve) => tx.addEventListener('complete', resolve));

  console.log('🚀 - data saved to the database:', content);
};

export const getDb = async () => {

  const db = await openDB(DB_NAME, 1);
  const tx = db.transaction(DB_NAME, 'readonly');
  const store = tx.objectStore(DB_NAME);

  // retrieve content from the object store 
  const request = store.get(1); 

  // await transaction to complete
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