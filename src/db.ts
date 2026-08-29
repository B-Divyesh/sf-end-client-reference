import type { RelationshipRecord } from './types';

const DB_NAME = 'performed-for';
const STORE = 'relationships';
const VERSION = 1;

let namespace = '';

/** Keep the catalog demo completely apart from a visitor's real relationship log. */
export function setStorageNamespace(nextNamespace: 'demo' | ''): void {
  namespace = nextNamespace;
}

function databaseName(): string {
  return namespace ? `${namespace}:${DB_NAME}` : DB_NAME;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName(), VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open local storage.'));
  });
}

async function transaction<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = action(tx.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Local storage action failed.'));
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error ?? new Error('Local storage transaction failed.'));
  });
}

export async function listRecords(): Promise<RelationshipRecord[]> {
  const records = await transaction('readonly', (store) => store.getAll());
  return (records as RelationshipRecord[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function putRecord(record: RelationshipRecord): Promise<IDBValidKey> {
  return transaction('readwrite', (store) => store.put(record));
}

export function removeRecord(id: string): Promise<undefined> {
  return transaction('readwrite', (store) => store.delete(id)) as Promise<undefined>;
}

export async function importRecords(records: RelationshipRecord[]): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    records.forEach((record) => store.put(record));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Import could not be saved.'));
  });
  db.close();
}

export async function clearRecords(): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Demo data could not be reset.'));
  });
  db.close();
}
