import type { RelationshipRecord } from './types';
import { isRelationshipRecord } from './records';

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
  return (records as unknown[]).filter(isRelationshipRecord).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function inspectRecords(): Promise<{ records: RelationshipRecord[]; invalidRecords: unknown[] }> {
  const stored = await transaction('readonly', (store) => store.getAll()) as unknown[];
  return {
    records: stored.filter(isRelationshipRecord).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    invalidRecords: stored.filter((record) => !isRelationshipRecord(record)),
  };
}

export function putRecord(record: RelationshipRecord): Promise<IDBValidKey> {
  if (!isRelationshipRecord(record)) return Promise.reject(new Error('Invalid relationship record.'));
  return transaction('readwrite', (store) => store.put(record));
}

export function removeRecord(id: string): Promise<undefined> {
  return transaction('readwrite', (store) => store.delete(id)) as Promise<undefined>;
}

export async function importRecords(records: RelationshipRecord[]): Promise<void> {
  if (!records.every(isRelationshipRecord)) throw new Error('Import contains an invalid relationship record.');
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

/** Delete only unreadable entries, preserving valid records and all localStorage data. */
export async function removeInvalidRecords(): Promise<number> {
  const db = await openDatabase();
  let removed = 0;
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const request = tx.objectStore(STORE).openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      if (!isRelationshipRecord(cursor.value)) {
        cursor.delete();
        removed += 1;
      }
      cursor.continue();
    };
    request.onerror = () => reject(request.error ?? new Error('Unreadable records could not be checked.'));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Unreadable records could not be removed.'));
    tx.onabort = () => reject(tx.error ?? new Error('Unreadable records could not be removed.'));
  });
  db.close();
  return removed;
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

/** Remove the active namespace completely when an ephemeral demo is left. */
export function deleteCurrentDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(databaseName());
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Demo data could not be discarded.'));
    request.onblocked = () => reject(new Error('Demo data is still in use. Close other demo tabs and try again.'));
  });
}
