import { MutationTree } from 'vuex'
import { State } from './state'
import { IAsset, IGoal } from '@/types/common';
import { ConnectorsTypes } from '@/components/connectors/ConnectFactory';
import { ADDRESS, CHAIN_ID, CONNECTION_TYPE } from '@/consts/localStorage';

export enum MutationType {
    setBalances = 'SET_BALANCES',
    setCurrentAddress = 'SET_CURRENT_ADDRESS',
    setChainId = 'SET_CHAIN_ID',
    setCurrentConnectionType = 'SET_CURRENT_CONNECTION_TYPE',
    disconnectWallet = 'DISCONNECT_WALLET',
    setPopupInfo = 'SET_POPUP_INFO',
    setSelectedAsset = 'SET_SELECTED_ASSET',
    setGoal = 'SET_GOAL',
}

export type Mutations = {
    [MutationType.setBalances](state: State, assets: IAsset[]): void;
    [MutationType.setCurrentAddress](state: State, address: string): void;
    [MutationType.setSelectedAsset](state: State, asset: IAsset| null): void;
    [MutationType.setChainId](state: State, chainId: number): void;
    [MutationType.setCurrentConnectionType](state: State, type: ConnectorsTypes): void;
    [MutationType.disconnectWallet](state: State): void;
    [MutationType.setPopupInfo](state: State, popupInfo: IPopupInfo | null);
    [MutationType.setGoal](state: State, goal: IGoal | null);
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationType.setBalances](state, assets) {
        state.assets = assets;
    },
    [MutationType.setCurrentAddress](state, address) {
        state.address = address;
        localStorage.setItem(ADDRESS, address);
    },
    [MutationType.setChainId](state, chainId) {
        state.chainId = chainId;
        localStorage.setItem(CHAIN_ID, String(chainId));
    },
    [MutationType.setCurrentConnectionType](state, type: ConnectorsTypes) {
        state.connectionType = type;
        localStorage.setItem(CONNECTION_TYPE, type);
    },
    [MutationType.disconnectWallet](state) {
        state.connectionType = null;
        state.address = '';
        localStorage.removeItem(CONNECTION_TYPE);
        localStorage.removeItem(ADDRESS);
    },
    [MutationType.setPopupInfo](state, popupInfo: IPopupInfo | null) {
        if (!popupInfo) {
            state.popupInfo = null;
        } else {
            state.popupInfo = { msg: popupInfo.msg, duration: popupInfo.duration ?? 4000 };
        }
    },
    [MutationType.setSelectedAsset](state, asset: IAsset | null) {
        state.selectedAsset = asset;
    },
    [MutationType.setGoal](state, goal: IGoal | null) {
        state.goal = goal;
    },
}

export interface IPopupInfo {
    msg: string;
    duration?: number;
}
