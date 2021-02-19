<template>
    <SelectListItemLayout
        :selected="connectionType === name"
        @click="connect"
    >
        <img :src="`/connectors/${imgName}`" alt="" class="connector__img">
        <span>
             {{ name }}
        </span>
    </SelectListItemLayout>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { MutationType } from '@/store/mutations';
import { ConnectFactory, ConnectorsTypes, ConnectStatuses } from '@/components/connectors/ConnectFactory';
import useNotification from '@/hooks/useNotification';
import { ActionTypes } from '@/store/actions';
import SelectListItemLayout from '@/components/layouts/SelectListItemLayout.vue';

export default defineComponent({
    name: 'connector',
    components: {
        SelectListItemLayout,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    setup(props, { emit }) {
        const { commit, state, dispatch } = useStore();
        const { notify } = useNotification();
        const accountsChangedHandler = (address: string, chainId: number) => {
            dispatch(ActionTypes.accountChange, { chainId, address });
        };

        const disconnectHandler = () => {
            commit(MutationType.disconnectWallet);
        };

        const connectionType = computed(() => state.connectionType);
        const imgName = computed(() => {
            if (props.name === 'MetaMask') {
                return 'MetaMask.png';
            } else {
                return 'WalletConnect.svg';
            }
        });

        const connect = async () => {
            const connector = ConnectFactory(props.name as ConnectorsTypes);
            const res = await connector.connect({
                accountsChangedHandler,
                disconnectHandler,
            });

            if (res.type === ConnectStatuses.success) {
                commit(MutationType.setCurrentAddress, res.address);
                commit(MutationType.setChainId, res.chainId);
                commit(MutationType.setCurrentConnectionType, props.name);

                await dispatch(ActionTypes.GetBalances);

                emit('connected');
            } else if (res.type === ConnectStatuses.chainIdError) {
                notify({ msg: 'Wrong network' });
            } else if (res.type === ConnectStatuses.undocummentedError) {
                notify({ msg: 'ERROR' });
            }
        };

        return {
            connect,
            connectionType,
            imgName,
        };
    }
});
</script>

<style scoped lang="scss">
.connector__img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 61px;
}
</style>
