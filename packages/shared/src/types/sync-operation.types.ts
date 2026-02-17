export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: SyncOperationData;
  timestamp: number;
  retries: number;
}

export interface SyncOperationData {
  id: string;
  [key: string]: unknown;
}

export interface SyncStatus {
  pending: number;
  synced: number;
  failed: number;
  lastSyncAt: string | null;
}
