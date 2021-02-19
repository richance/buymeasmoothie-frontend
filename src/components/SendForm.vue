<template>
    <form class="sendForm" @submit.prevent="sendTransaction">
        <div class="sendForm__head">
            <div class="sendForm__info">
                <span class="sendForm__donateFor">
                    Donate for
                </span>
                <span class="sendForm__infoText">
                    {{ goal?.name }}
                </span>
            </div>

            <a :href="getScanLink(address, goal?.chain ?? 0)" target="_blank" class="sendForm__address">
                {{ shortAddress }}
            </a>

            <RouterLink :to="{ name: 'SelectAsset' }" class="sendForm__asset">
                <img v-if="selectedAsset" :src="selectedAsset?.logo_url ?? ''" alt="assetLogo" class="sendForm__assetLogo">
                <span class="sendForm__assetName">
                    {{ selectedAsset?.symbol ?? 'Not supported' }}
                </span>
            </RouterLink>
        </div>
        <input :value="count" class="sendForm__count" placeholder="0" @input="handleInput">
        <input v-model="comment" class="sendForm__comment" placeholder="Say some words..." maxlength="150">
        <div class="sendForm__bottom">
            <button type="button" class="sendForm__max" @click="setMax">
                MAX: {{ round(selectedAsset?.balance ?? 0) }} {{ selectedAsset?.symbol ?? '' }}
            </button>

            <button type="submit" class="sendForm__send">
                <Loader v-if="loading" class="sendForm__loader" />
                <span v-else>
                    SEND
                </span>
            </button>
        </div>
    </form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import getShortAddress from '@/utils/getShortAddress';
import { validateAddress } from '@/utils/validateAddress';
import { getScanLink } from '@/utils/getScanAddressLink';
import { useStore } from 'vuex';
import { IAsset } from '@/types/common';
import round from '@/utils/round';
import { ConnectFactory, SendTransactionStatuses } from '@/components/connectors/ConnectFactory';
import useNotification from '@/hooks/useNotification';
import { ActionTypes } from '@/store/actions';
import Loader from '@/components/Loader.vue';
import { DONATE_ID, USER_ID } from '@/consts/sessionStorage';
import doubleConfetti from '@/utils/confetti';

export default defineComponent({
    name: 'SendForm',
    components: {
        Loader,
    },
    setup() {
        const count = ref<string>('');
        const comment = ref<string>('');
        const loading = ref<boolean>(false);
        const router = useRouter();
        const { state, dispatch } = useStore();
        const { notify } = useNotification();

        const goal = computed(() => state.goal);
        const address = computed(() => goal.value?.address ?? '');

        const shortAddress = computed(() => getShortAddress(address.value));
        const selectedAsset = computed<IAsset>(() => state.selectedAsset);

        const setMax = () => {
            count.value = String(Number(selectedAsset.value?.balance ?? 0));
        };

        const handleInput = (e) => {
            let value = e.target.value;

            if (value === '') {
                count.value = '';
                e.target.value = '';

                return;
            }

            if (value[value.length - 1] === ',') {
                value = value.replace(/.$/,'.');
            }

            if (!isNaN(value) && !value.includes(' ') && Number(value) >= 0) {
                count.value = value
            } else {
                e.target.value = count.value;
            }

        };

        const sendTransaction = async () => {
            const value = count.value;

            if (!value || Number(value) <= 0) {
                notify({ msg: 'Value should be greater than zero' });

                return;
            }

            loading.value = true;
            const connector = ConnectFactory(state.connectionType);

            dispatch(ActionTypes.saveTransaction, {
                comment: comment.value,
                token_address: selectedAsset.value.address,
                symbol: selectedAsset.value.symbol,
                user_id: sessionStorage.getItem(USER_ID),
                donate_id: sessionStorage.getItem(DONATE_ID),
                value,
                from_address: state.address,
            });

            const res = await connector.sendTransaction(selectedAsset.value, state.address, address.value, Number(value));

            if (res.type === SendTransactionStatuses.success) {
                comment.value = '';

                doubleConfetti();
            } else {
                if (res.type !== SendTransactionStatuses.canceled) {
                    notify({ msg: 'ERROR', duration: 3000 });
                }
            }

            loading.value = false;
        };

        return {
            count,
            shortAddress,
            selectedAsset,
            getScanLink,
            handleInput,
            round,
            setMax,
            sendTransaction,
            loading,
            goal,
            comment,
            address,
        };
    },
});
</script>
<style lang="scss">
.sendForm {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 475px;

    .sendForm__donateForm,
    a,
    button {
        font-size: 22px;
    }
}

.sendForm__head {
    display: grid;
    grid-template-columns: repeat(2, minmax(118px, 236px));
    grid-template-rows: repeat(2, 115px);
    grid-gap: 3px;
}

.sendForm__info {
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 22px;
    background-color: #D3D3D3;
}

.sendForm__donateFor {
    font-size: 22px;
    line-height: 1.5;
}

.sendForm__donateForm {
    font-style: italic;
    line-height: 1.5;
}

.sendForm__infoText {
    font-weight: bold;
    font-style: normal;
    font-size: 33px;
    line-height: 1.5;
    text-align: center;
    padding: 8px;
}

.sendForm__address {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #D3D3D3;
    border-radius: 22px;
    font-weight: bold;
    font-style: normal;
}

.sendForm__asset {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-style: normal;
    border-radius: 22px;
    background-color: rgba(#3b99fc, 0.1);
    border: 1px solid #3B99FC;
    padding: 16px 0;
}

.sendForm__assetLogo {
    width: 44px;
}

.sendForm__assetName {
    margin-left: 16px;
}

.sendForm__count {
    background-color: rgba(#3b99fc, 0.1);
    height: 153px;
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    border: 1px solid #3B99FC;
    border-radius: 22px;
    margin-top: 3px;

    &::placeholder {
        color: black;
    }
}

.sendForm__comment {
    margin-top: 3px;
    height: 76px;
    border-radius: 22px;
    font-size: 22px;
    line-height: 1.2;
    border: 1px solid #3B99FC;
    text-align: center;
    font-weight: bold;
    color: black;

    &::placeholder {
        width: 100%;
        text-transform: uppercase;
        color: #d3d3d3;
    }
}

.sendForm__bottom {
    display: grid;
    grid-template-columns: repeat(2, minmax(118px, 236px));
    grid-template-rows: 115px;
    grid-column-gap: 3px;
    margin-top: 3px;
}

.sendForm__max {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #23B995;
    border-radius: 22px;
    text-transform: uppercase;
    color: white;
    font-weight: bold;
    font-style: normal;
    cursor: pointer;
}

.sendForm__send {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(339deg, #FBAB7E 33%, #FFC6A6 111%);
    border-radius: 22px;
    font-weight: bold;
    font-style: italic;
    cursor: pointer;
    color: white;
}

.sendForm__loader {
    width: 50px;
    height: 50px;
}

@media screen and (max-width: 420px) {
    .sendForm__head {
        grid-template-rows: repeat(2, 90px);
    }

    .sendForm__bottom {
        grid-template-rows: 90px;
    }

    .sendForm__count {
        height: 200px;
    }
}

@media screen and (max-width: 350px) {
    .sendForm {
        .sendForm__donateForm,
        a,
        button {
            font-size: 18px;
        }
    }
}
</style>
