<template>
    <div class="selectAsset">
        <SubpageHeader title="Select asset" class="selectAsset__header" />

        <ul class="selectAsset__list">
            <li v-for="asset in assets" :key="asset.symbol" @click="selectAsset(asset)">
                <SelectListItemLayout
                    :title="asset.symbol"
                    :img="asset.logo_url"
                    :selected="selectedAsset.symbol === asset.symbol"
                    class="asset"
                >
                    <span class="asset__name">
                        {{ asset.name }}
                    </span>

                    <img :src="asset.logo_url" :alt="asset.symbol" class="asset__img">

                    <span class="asset__balance">
                        {{ asset.balance }} {{ asset.symbol }}
                    </span>
                </SelectListItemLayout>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import SubpageHeader from '@/components/SubpageHeader.vue';
import SelectListItemLayout from '@/components/layouts/SelectListItemLayout.vue';
import { IAsset } from '@/types/common';
import { MutationType } from '@/store/mutations';

export default defineComponent({
    name: 'SelectAsset',
    components: {
        SubpageHeader,
        SelectListItemLayout,
    },
    setup() {
        const router = useRouter();
        const { state, commit } = useStore();

        const currentAddress = computed(() => state.address);
        const assets = computed<IAsset[]>(() => state.assets);
        const selectedAsset = computed<IAsset>(() => state.selectedAsset);

        if (!currentAddress.value) {
            router.replace({ name: 'Home' });
        }

        const selectAsset = (asset: IAsset) => {
            commit(MutationType.setSelectedAsset, asset);
            router.push({ name: 'Home' });
        };



        return {
            assets,
            selectedAsset,
            selectAsset,
        };
    },
});
</script>

<style scoped lang="scss">
.selectAsset {
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
    min-height: 100vh;
    background-color: #EFEFEF;
    overflow: auto;
}

.selectAsset__header {
    margin-bottom: 32px;
}

.selectAsset__list {
    display: grid;
    grid-template-columns: repeat(4, 163px);
    grid-gap: 3px;
    justify-content: center;
    margin: auto 0;
}

.asset {
    justify-content: space-between;
}

.asset__name {
    font-size: 16px;
    line-height: 1.5;
}

.asset__img {
    width: 56px;
}

.asset__balance {
    font-size: 16px;
    line-height: 1.5;
    font-weight: bold;
    font-style: normal;
}

@media screen and (max-width: 750px) {
    .selectAsset__list {
        grid-template-columns: repeat(2, 163px);
    }
}

@media screen and (max-width: 350px) {
    .selectAsset {
        padding: 8px 16px;
    }

    .selectAsset__list {
        grid-template-columns: repeat(2, 140px);
    }
}
</style>
