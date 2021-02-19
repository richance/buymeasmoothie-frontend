<template>
    <header class="subpageHeader">
        <i class="icon-back" @click="goBack" />
        <h1 class="subpageHeader__title">
            {{ title }}
        </h1>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'SubpageHeader',
    props: {
        title: {
            type: String,
            default: '',
        },
    },
    setup() {
        const router = useRouter();

        const goBack = () => router.go(-1);

        return {
            goBack,
        };
    }
});
</script>

<style scoped lang="scss">
.subpageHeader {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 36px;

    .icon-back {
        cursor: pointer;
        font-size: 22px;
    }
}

.subpageHeader__title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-style: normal;
    width: 100%;
    text-align: center;
    pointer-events: none;
}
</style>
