export enum TransactionStatus {
    NEW = 'NEW',
    OLD = 'OLD',
    ONDELETE = 'ONDELETE'
}

export interface Transaction {
    name: string,
    type: boolean,
    createdAt: string,
    entryStamp: string,
    transfer: number,
    p: number,
    c: number,
    g: number,
    status: TransactionStatus
}