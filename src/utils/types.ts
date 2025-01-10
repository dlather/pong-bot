enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export type DB_SCHEMA = {
  lastProcessedBlock: number;
  nonce?: number;
  payload?: string;
  pendingTxnHash?: string;
  status?: TransactionStatus;
};
