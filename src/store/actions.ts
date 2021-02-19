import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationType } from './mutations'
import { State } from './state'
import { ADDRESS, CHAIN_ID, CONNECTION_TYPE } from '@/consts/localStorage';
import { ConnectFactory, ConnectorsTypes } from '@/components/connectors/ConnectFactory';
import { http, IHttpResponse } from '@/http';
import { IAsset, ISaveTransactionData } from '@/types/common';
import { SUPPORTING_NETWORKS } from '@/consts/networkIds';

export enum ActionTypes {
    GetBalances = 'GET_BALANCES',
    RestoreAccountInfo = 'RESTORE_ACCOUNT_INFO',
    saveTransaction = 'SAVE_TRANSACTION',
    getGoal = 'GET_GOAL',
    accountChange = 'ACCOUNT_CHANGE',
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
    commit<K extends keyof Mutations>(
      key: K,
      payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>;
  }
export type Actions = {
    [ActionTypes.GetBalances](context: ActionAugments): Promise<IHttpResponse<IAsset[]>>;
    [ActionTypes.saveTransaction](context: ActionAugments, data: ISaveTransactionData): Promise<IHttpResponse>;
    [ActionTypes.getGoal](context: ActionAugments, data: { userId: string, donateId: string }): Promise<IHttpResponse>;
    [ActionTypes.accountChange](context: ActionAugments, data: { address: string, chainId: number }): Promise<IHttpResponse>;
}

export const actions: ActionTree<State, State> & Actions = {
    async [ActionTypes.RestoreAccountInfo]({ commit, dispatch }) {
        const connectionType = localStorage.getItem(CONNECTION_TYPE);

        if (connectionType) {
            const connectFactory = ConnectFactory(connectionType as ConnectorsTypes);

            if (connectFactory.checkConnection()) {
                connectFactory.setHandlers({
                    disconnectHandler: () => commit(MutationType.disconnectWallet),
                    accountsChangedHandler: (address, chainId) => dispatch(ActionTypes.accountChange, {
                        address,
                        chainId,
                    }),
                });
                commit(MutationType.setCurrentConnectionType, connectionType);

                await dispatch(ActionTypes.accountChange, {
                    address: connectFactory.getSelectedAddress(),
                    chainId: connectFactory.getChainId()
                });

                return;
            }
        }

        commit(MutationType.disconnectWallet);
    },
    async [ActionTypes.GetBalances]({ commit, state }) {
        try {
            if (!SUPPORTING_NETWORKS.includes(state.chainId)) {
                commit(MutationType.setSelectedAsset, null);

                return { status: 200 };
            }

            const res = await http.get('balances/', {
                params: {
                    address: state.address,
                    chain_id: state.chainId,
                },
            });

            commit(MutationType.setBalances, res.data.items);
            commit(MutationType.setSelectedAsset, state.assets[0] ?? null);

            return { status: 200 };
        } catch (error) {
            return { status: error?.response?.status ?? 500 };
        }
    },
    async [ActionTypes.saveTransaction](context, data: ISaveTransactionData) {
        try {
            await http.post('transactions/', data);

            return { status: 200 };
        } catch (error) {
            return { status: error?.response?.status ?? 500 };
        }
    },
    async [ActionTypes.getGoal]({ commit }, data) {
        try {
            const res = await http.get('donates/', {
                params: {
                    user_id: data.userId,
                    donate_id: data.donateId,
                },
            });

            commit(MutationType.setGoal, res.data);

            return { status: 200, data: res.data };
        } catch (error) {
            return { status: error?.response?.status ?? 500 };
        }
    },
    async [ActionTypes.accountChange]({ commit, dispatch }, data) {
        const { address, chainId } = data;

        commit(MutationType.setCurrentAddress, address);
        commit(MutationType.setChainId, chainId);

        dispatch(ActionTypes.GetBalances);

        return { status: 200 };
    },
}
