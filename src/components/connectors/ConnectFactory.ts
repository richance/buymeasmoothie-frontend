import { SUPPORTING_NETWORKS } from '@/consts/networkIds';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { Decimal } from 'decimal.js';
import { WEI_VALUE } from '@/consts/common';
import Web3 from 'web3';
import { IAsset } from '@/types/common';
import ABI from '@/consts/ABI';

import EthQuery from 'ethjs-query';

export type ConnectorsTypes = 'MetaMask' | 'WalletConnect';

export type TxHash = string;

export enum ConnectStatuses {
    success,
    chainIdError,
    notFoundTool,
    undocummentedError,
}

export enum SendTransactionStatuses {
    success,
    canceled,
    undocummentedError,
}

interface IConnectResponse {
    type: ConnectStatuses;
    address?: string;
    chainId?: number;
}

interface ISendTransactionResponse {
    type: SendTransactionStatuses,
    txHash?: TxHash;
}

interface IConnector {
    connect: (handlers?: IChangeHandlers) => Promise<IConnectResponse>;
    getSelectedAddress: () => string;
    getChainId: () => number;
    checkConnection: () => boolean;
    sendTransaction: (asset: IAsset, from: string, to: string, value: number) => Promise<ISendTransactionResponse>;
    disconnect: () => void;
    setHandlers: (handlers: IChangeHandlers) => void;
}

interface IChangeHandlers {
    accountsChangedHandler: (address: string, chainId: number) => void;
    disconnectHandler: () => void;
}

export const ConnectFactory = (type: ConnectorsTypes): IConnector => {
    switch (type) {
    case 'MetaMask': {
        return new ConnectMetamask();
    }
    case 'WalletConnect': {
        return new ConnectWalletConnect();
    }
    }
}

class ConnectMetamask implements IConnector {
    public async connect(handlers): Promise<IConnectResponse> {
        const ethereum = window.ethereum;
        const { chainId } = ethereum;

        if (ethereum) {
            if (handlers) {
                this.setHandlers(handlers);
            }

            try {
                const res = await ethereum.request({ method: 'eth_requestAccounts' });

                return { type: ConnectStatuses.success, address: res[0], chainId: parseInt(chainId, 16) };
            } catch(error) {
                return { type: ConnectStatuses.undocummentedError };
            }
        } else {
            return { type: ConnectStatuses.notFoundTool };
        }
    }

    public getChainId(): number {
        return parseInt(window.ethereum.chainId, 16);
    }

    public getSelectedAddress(): string {
        return window.ethereum.selectedAddress
    }

    public checkConnection(): boolean {
        return Boolean(window.ethereum?.selectedAddress ?? false);
    }

    public async sendTransaction(asset: IAsset, from: string, to: string, value: number): Promise<ISendTransactionResponse> {
        try {
            const ethereum = window.ethereum;
            const DValue = new Decimal(value);
            const isContract = asset.address !== '-';
            let params;

            const block = await new EthQuery(Web3.givenProvider).getBlockByNumber('latest', false);
            const gas = new Decimal(block.gasLimit.toString()).dividedBy(block.transactions.length).ceil().toHex();

            if (!isContract) {
                params = {
                    from,
                    to: to,
                    value: DValue.mul(WEI_VALUE).toHex(),
                    gas,
                };
            } else {
                params = {
                    from,
                    to: asset.address,
                    data: getDataForTransaction(asset, from, to, DValue),
                    gas,
                };
            }

            const txHash =  await ethereum.request({ method: 'eth_sendTransaction', params: [params] });

            return { type: SendTransactionStatuses.success, txHash };
        } catch (e) {
            if (e?.code === 4001) {
                return { type: SendTransactionStatuses.canceled };
            }

            return { type: SendTransactionStatuses.undocummentedError };
        }
    }

    public setHandlers(handlers: IChangeHandlers): void {
        window.ethereum?.on('accountsChanged', (accounts: string[]) => {
            handlers.accountsChangedHandler(window.ethereum.selectedAddress, Number(window.ethereum.chainId))
        });
        window.ethereum?.on('chainChanged', (chainId: number | string) => {
            handlers.accountsChangedHandler(window.ethereum.selectedAddress, Number(chainId));
        });
    }

    public disconnect(): void {

    }
}

class ConnectWalletConnect implements IConnector {
    private readonly connectorOptions = {
        bridge: 'https://walletconnect-bridge.buymeasmoothie.xyz/',
        qrcodeModal: QRCodeModal,
    }

    public async connect(handlers): Promise<IConnectResponse> {
        try {
            const result = await new Promise<IConnectResponse>((resolve) => {
                const connector = new WalletConnect(this.connectorOptions);

                if (connector.connected) {
                    const { accounts, chainId } = connector;

                    if (!SUPPORTING_NETWORKS.includes(chainId)) {
                        resolve({ type: ConnectStatuses.chainIdError });
                    }

                    resolve({ type: ConnectStatuses.success, address: accounts[0], chainId });
                } else {
                    connector.createSession();

                    connector.on('connect', (error, payload) => {
                        if (error) {
                            resolve({ type: ConnectStatuses.undocummentedError });
                        }

                        const { accounts, chainId } = payload.params[0];

                        if (!SUPPORTING_NETWORKS.includes(chainId)) {
                            resolve({ type: ConnectStatuses.chainIdError });
                        }

                        resolve({ type: ConnectStatuses.success, address: accounts[0], chainId });
                    });
                }
            });

            if (handlers) {
                this.setHandlers(handlers);
            }

            return result;
        } catch (e) {
            return { type: ConnectStatuses.undocummentedError };
        }
    }

    public getSelectedAddress(): string {
        const connector = new WalletConnect(this.connectorOptions);

        return connector.accounts[0];
    }

    public getChainId(): number {
        const connector = new WalletConnect(this.connectorOptions);

        return connector.chainId;
    }


    public checkConnection(): boolean {
        const connector = new WalletConnect(this.connectorOptions);

        return connector.connected;
    }

    public async sendTransaction(asset: IAsset, from: string, to: string, value: number): Promise<ISendTransactionResponse> {
        try {
            const connector = new WalletConnect(this.connectorOptions);

            const DValue = new Decimal(value);
            const isEth = !Boolean(asset.address);

            if (isEth) {
                const txHash = await connector.sendTransaction({
                    from,
                    to,
                    value: DValue.mul(WEI_VALUE).toString(),
                });

                return { type: SendTransactionStatuses.success, txHash };
            } else {
                const txHash =  await connector.sendTransaction({
                    from,
                    to: asset.address,
                    data: getDataForTransaction(asset, from, to, DValue),
                });

                return { type: SendTransactionStatuses.success, txHash };
            }
        } catch (e) {
            if (e?.message === 'User canceled') {
                return { type: SendTransactionStatuses.canceled };
            }

            return { type: SendTransactionStatuses.undocummentedError };
        }
    }

    public setHandlers(handlers: IChangeHandlers): void {
        const connector = new WalletConnect(this.connectorOptions);

        connector.on('disconnect', handlers.disconnectHandler);
        connector.on('session_update', (error, payload) => {
            const { accounts, chainId } = payload.params[0];

            if (!SUPPORTING_NETWORKS.includes(chainId)) {
                handlers.disconnectHandler();
                this.disconnect();
            } else {
                handlers.accountsChangedHandler(accounts[0], chainId);
            }
        });
    }

    public disconnect(): void {
        const connector = new WalletConnect(this.connectorOptions);

        connector.killSession();
    }
}

function getDataForTransaction(asset: IAsset, from: string, to: string, value: Decimal) {
    const web3 = new Web3(Web3.givenProvider);
    const token = new web3.eth.Contract(ABI as any, asset.address);
    const decimals = new Decimal(10).pow(asset.decimals);

    return token.methods.transfer(to, value.mul(decimals).toHexadecimal()).encodeABI();
}
