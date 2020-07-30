export enum TransactionStatus {
    NEW = 'NEW',
    OLD = 'OLD',
    ONDELETE = 'ONDELETE'
}

export interface Transaction {
    name: string,
    member_Id: number,
    trans_id: number,
    formSeq: number,
    seq: number,
    entryTime: string,
    type: boolean,
    createdAt: string,
    transfer: number,
    p: number,
    c: number,
    g: number,
    status: TransactionStatus
}

export interface TransHttpResponse extends Transaction {
    success: boolean,
    count: number,
    list: Array<Transaction>
}