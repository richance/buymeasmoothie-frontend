<template>
    <canvas id="canvas" />
    <Loader v-if="loading" color="#BFBFBF" class="appLoader" />
    <RouterView v-else />
    <Notification />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { ActionTypes } from '@/store/actions';
import Notification from '@/components/Notification.vue';
import Loader from '@/components/Loader.vue';

export default defineComponent({
    name: 'App',
    components: {
        Notification,
        Loader,
    },
    setup() {
        const { dispatch } = useStore();
        const loading = ref(true);

        window.addEventListener('load', async () => {
            await dispatch(ActionTypes.RestoreAccountInfo);
            loading.value = false;
        });

        return {
            loading,
        };
    }
});
</script>

<style lang="scss">
@import "/fonts/icon-font/icon-font.css";

* {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(black, 0);
}

body,
html {
    margin: 0;
    padding: 0;
    height: 100%;
}

h1,
h2,
h3,
h4,
h5 {
    margin: 0;
}

img {
    pointer-events: none;
    user-select: none;
}

a {
    user-select: none;
    text-decoration: none;
    color: inherit;
}

p {
    margin: 0;
}

ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
}

input {
    border-radius: 0;
    margin: 0;
    -webkit-appearance: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type=number] {
    -moz-appearance: textfield;
}

input:focus,
button:focus {
    outline: none;
}

button {
    border-radius: 0;
    outline: none;
    border: none;
}


#app {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    font-family: 'Lato';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-style: italic;
}

#canvas {
    position: fixed;
    width: 100%;
    height: 100%;
    box-sizing: content-box;
    pointer-events: none;
}

.appLoader {
    margin: auto;
    width: 150px;
    height: 150px;
}

@font-face {
    font-family: 'icon-font';
    font-weight: normal;
    font-style: normal;
    src: url('/fonts/icon-font/icon-font.woff') format('woff');
}

@font-face {
    font-family: 'Lato';
    font-weight: normal;
    font-style: italic;
    src: url('/fonts/Lato/Lato-Italic.woff') format('woff');
}

@font-face {
    font-family: 'Lato';
    font-weight: bold;
    font-style: normal;
    src: url('/fonts/Lato/Lato-Bold.woff') format('woff');
}

@font-face {
    font-family: 'Lato';
    font-weight: normal;
    font-style: normal;
    src: url('/fonts/Lato/Lato-Regular.woff') format('woff');
}

@font-face {
    font-family: 'Lato';
    font-weight: 900;
    font-style: normal;
    src: url('/fonts/Lato/Lato-Black.woff') format('woff');
}
</style>
