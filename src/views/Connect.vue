<template>
    <div class="connect">
        <SubpageHeader title="Connect" />

        <ul class="connect__list">
            <li v-for="c in connectors" :key="c" class="connect__item">
                <Connector :name="c" @connected="goToRoot" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { ConnectorsTypes } from '@/components/connectors/ConnectFactory';
import Connector from '@/components/connectors/Connector.vue';
import SubpageHeader from '@/components/SubpageHeader.vue';

export default defineComponent({
    name: 'Connect',
    components: {
        Connector,
        SubpageHeader,
    },
    setup() {
        const router = useRouter();
        const connectors: ConnectorsTypes[] = ['MetaMask', 'WalletConnect'];

        return {
            goToRoot: router.push.bind(null, { name: 'Home' }),
            connectors,
        };
    }
});
</script>

<style scoped lang="scss">
.connect {
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
    background-color: #EFEFEF;
    min-height: 100vh;
}

.connect__list {
    display: grid;
    grid-template-columns: repeat(2, 163px);
    grid-gap: 3px;
    justify-content: center;
    align-items: center;
    margin: auto 0;
}

@media screen and (max-width: 350px) {
    .connect {
        padding: 8px 16px;
    }

    .connect__list {
        grid-template-columns: repeat(2, 140px);
    }
}
</style>
