import { DesenhosMap, ResenhaData } from '../types';

const DATABASE = 'amorimpec_resenha_v2';
const STORE = 'records';
const DRAFT_KEY = 'draft';

export const DESENHOS_VAZIOS: DesenhosMap = {
  latEsq: null,
  latDir: null,
  frontal: null,
  chanfro: null,
  peito: null,
};

export interface RascunhoSalvo {
  data: ResenhaData;
  historicoMarcas: string[];
  desenhos: DesenhosMap;
  descricaoEditadaManualmente: boolean;
  currentStep: number;
  updatedAt: number;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readRecord<T>(key: string): Promise<T | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get(key);
    request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => db.close();
  });
}

async function writeRecord(key: string, value: unknown): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

async function removeRecord(key: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export const carregarRascunho = () => readRecord<RascunhoSalvo>(DRAFT_KEY);
export const salvarRascunho = (draft: RascunhoSalvo) => writeRecord(DRAFT_KEY, draft);
export const limparRascunho = () => removeRecord(DRAFT_KEY);
export const salvarDesenhosHistorico = (id: string, drawings: DesenhosMap) => writeRecord(`history:${id}`, drawings);
export const carregarDesenhosHistorico = (id: string) => readRecord<DesenhosMap>(`history:${id}`);
export const apagarDesenhosHistorico = (id: string) => removeRecord(`history:${id}`);
