import { IAsset, IGoal } from '@/types/common';
import { ConnectorsTypes } from '@/components/connectors/ConnectFactory';
import { IPopupInfo } from '@/store/mutations';

export type State = {
    assets: IAsset[];
    selectedAsset: IAsset | null;
    address: string;
    chainId: number;
    connectionType: ConnectorsTypes | null;
    popupInfo: IPopupInfo | null;
    goal: IGoal | null;
};

export const state: State = {
    assets: [],
    selectedAsset: null,
    address: '',
    chainId: 0,
    connectionType: null,
    popupInfo: null,
    goal: null,
};
