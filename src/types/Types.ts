export type branch = {
    ifsc: string,
    bank: string,
    branch: string,
    address: string,
    city: string,
    district: string,
    state: string,
}

export enum REQUEST_STATUS {
    LOADING,
    ERROR,
    SUCCEED,
}

export type response = {
    count: number,
    branches: branch[],
}