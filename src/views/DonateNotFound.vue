<template>
    <div class="donateNotFound">
        <Header />

        <main class="donateNotFound__main">
            <h1 class="donateNotFound__title">
                The author has deleted the
                <br>
                donation for this wallet
            </h1>

            <img src="/notfound.gif" alt="notfound" class="donateNotFound__img">

            <hr class="donateNotFound__hr">
        </main>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Header from '@/components/Header.vue';

export default defineComponent({
    name: 'DonateNotFound',
    components: {
        Header,
    },
    setup() {

    }
});
</script>

<style scoped lang="scss">
.donateNotFound {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}

.donateNotFound__main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: auto 0;
}

.donateNotFound__title {
     text-align: center;
    font-weight: normal;
    font-size: 28px;
    margin-bottom: 67px;
}

.donateNotFound__img {
    width: 33vw;
}

.donateNotFound__hr {
    margin: 0;
    border: none;
    height: 1px;
    background-color: #AAAAAA;
    width: 100%;
}

@media screen and (max-width: 750px) {
    .donateNotFound__img {
        width: 100%;
    }
}

@media screen and (max-width: 350px) {
    .donateNotFound__title {
        font-size: 22px;
        margin-bottom: 48px;
    }
}
</style>
