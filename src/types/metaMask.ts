export type Event = 'accountsChanged' | 'chainChanged';
export type Method = 'eth_requestAccounts' | 'eth_sendTransaction';

export interface IMetaMaskRequest {
    method: Method;
    params?: any;
}

export interface IMetaMaskApi {
    request: (arg: IMetaMaskRequest) => Promise<string>;
    chainId: string;
    selectedAddress: string;
    isConnected: () => boolean;
    on: (event: Event, hadnler: (...args) => void) => void;
}
