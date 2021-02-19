<template>
    <div class="header">
        <RouterLink to="/" class="header__homeLink">
            <img src="/logo.png" alt="logo" class="header__logo" />
            <img v-if="!currentAddress" src="/logoText.png" alt="logo" class="header__logoText" />
        </RouterLink>

        <AccountDisplay v-if="currentAddress" :address="currentAddress" />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import AccountDisplay from '@/components/account/AccountDisplay.vue';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'Header',
    components: {
        AccountDisplay,
    },
    setup() {
        const { state } = useStore();

        const currentAddress = computed(() => state.address);

        return {
            currentAddress,
        };
    }
});
</script>

<style scoped lang="scss">
.header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px 16px;
    z-index: 5;
}

.header__homeLink {
    display: flex;
    align-items: center;
}

.header__logoText {
    width: 105px;
    margin-right: auto;
    margin-left: 5px;
}

.header__logo {
    width: 40px;
}

@media screen and (max-width: 350px) {
    .header {
        padding: 8px 16px;
    }
}
</style>
