<template>
    <div v-click-outside="closeModal" class="accountDisplay">
        <div class="accountDisplay__optionsContainer">
            <span class="accountDisplay__chain">
                {{ chainName }}
            </span>
            <a :href="scanLink" target="_blank" class="accountDisplay__address">
                {{ shortAddress }}
            </a>
            <button class="accountDisplay__optionsBtn" @click="toggleModal">
                <i class="icon-options" />
            </button>

            <div v-show="isOptionsShown" class="accountDisplay__options">
                <button class="options__change" @click="changeAccount">
                    Change account
                </button>

                <button class="options__disconnect" @click="disconnectAccount">
                    Disconnect
                </button>
            </div>
        </div>
        <a href="https://t.me/buymeasmoothie_bot" target="_blank" class="accountDisplay__botLink">
            <img src="/money.png" alt="bot">
        </a>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import useModal from '@/hooks/useModal';
import { useStore } from 'vuex';
import { MutationType } from '@/store/mutations';
import { useRouter } from 'vue-router';
import getShortAddress from '@/utils/getShortAddress';
import { getScanLink } from '@/utils/getScanAddressLink';
import { ConnectFactory } from '@/components/connectors/ConnectFactory';
import { NETWORKS_NAMES } from '@/consts/networkIds';
import { SMALLEST_SCREEN } from '@/consts/screenSizes';

export default defineComponent({
    name: 'AccountDisplay',
    props: {
        address: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const { commit, state } = useStore();
        const {
            isModalOpen: isOptionsShown,
            toggleModal,
            closeModal,
        } = useModal();
        const router = useRouter();

        const shortAddress = computed(() => {
            if (window.innerWidth <= SMALLEST_SCREEN) {
                return getShortAddress(props.address, true);
            } else {
                return getShortAddress(props.address)
            }
        });
        const scanLink = computed(() => getScanLink(props.address, state.chainId));
        const chainName = computed(() => NETWORKS_NAMES[state.chainId] ?? '');

        const disconnectAccount = () => {
            const connector = ConnectFactory(state.connectionType);

            connector.disconnect();
            commit(MutationType.disconnectWallet);
            closeModal();
        };

        const changeAccount = () => {
            router.push({ name: 'Connect' });
            closeModal();
        };

        return {
            shortAddress,
            toggleModal,
            isOptionsShown,
            disconnectAccount,
            changeAccount,
            closeModal,
            scanLink,
            chainName,
        };
    }
});
</script>

<style scoped lang="scss">
.accountDisplay {
    display: flex;
    align-items: center;
    height: 50px;
}

.accountDisplay__chain {
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    margin: auto 10px auto 0;
}

.accountDisplay__address {
    display: flex;
    align-items: center;
    border-radius: 16px;
    background-color: #EEEEEE;
    color: black;
    font-weight: bold;
    font-size: 16px;
    padding: 13px 12px;
    height: 50px;
    font-style: normal;
    margin-right: 3px;
}

.accountDisplay__optionsContainer {
    position: relative;
    display: flex;
}

.accountDisplay__optionsBtn {
    width: 50px;
    height: 50px;
    background-image: linear-gradient(339deg, #FBAB7E 33%, #FFC6A6 111%);
    border-radius: 16px;
    cursor: pointer;

    .icon-options {
        font-size: 23px;
    }
}

.accountDisplay__botLink {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 16px;
    background-color: #492073;
    margin-left: 3px;

    img {
        width: 30px;
    }
}

.accountDisplay__options {
    position: absolute;
    right: 0;
    top: 50px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.options__change,
.options__disconnect {
    height: 50px;
    border-radius: 16px;
    padding: 0;
    color: white;
    cursor: pointer;
}

.options__change {
    width: 100%;
    background-image: linear-gradient(297deg, #FBAB7E 8%, #F7CE68 92%);
}

.options__disconnect {
    width: 80%;
    background-color: #F72C61;
}
</style>
