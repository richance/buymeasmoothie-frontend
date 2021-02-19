<template>
    <Modal>
        <div class="infoModal">
            <img src="/emoji/dont-know-emoji.png" alt="not-found" class="infoModal__emoji">

            <p class="infoModal__text">
                The author of this donation accepts on the {{ acceptingNetwork }} network, but you are now in {{ currentNetwork }} network. Change the network.
            </p>

            <a href="https://buymeasmoothie.medium.com/how-to-change-the-network-in-metamask-45942d6043a1" target="_blank" class="infoModal__changeNetwork">
                How do I change the network? <i class="icon-back" />
            </a>
        </div>
    </Modal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Modal from '@/components/Modal.vue';
import { ETH_NETWORK_ID, NETWORKS_NAMES } from '@/consts/networkIds';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'InfoModal',
    components: { Modal },
    setup() {
        const { state } = useStore();
        const acceptingNetwork = computed(() => NETWORKS_NAMES[state.goal?.chain ?? ETH_NETWORK_ID]);
        const currentNetwork = computed(() => NETWORKS_NAMES[state.chainId] ?? 'unknown');

        return {
            acceptingNetwork,
            currentNetwork,
        };
    },
});
</script>

<style scoped lang="scss">
.infoModal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: black;
    width: 402px;
    height: 370px;
    border-radius: 20px;
}

.infoModal__emoji {
    width: 54px;
    margin-top: auto;
    margin-bottom: 24px;
}

.infoModal__text {
    max-width: 257px;
    text-transform: uppercase;
    font-size: 16px;
    color: white;
    font-style: normal;
    font-weight: bold;
    line-height: 150%;
    text-align: center;
}

.infoModal__changeNetwork {
    margin-top: auto;
    margin-bottom: 28px;
    color: #FBAB7E;
    font-weight: bold;
    text-transform: uppercase;
    font-style: normal;
    font-size: 12px;

    .icon-back {
        display: inline-block;
        font-size: 10px;
        transform: rotate(135deg) translateY(1px);
    }
}

@media screen and (max-width: 420px) {
    .infoModal {
        width: 92vw;
    }
}
</style>
