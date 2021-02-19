<template>
   <div :style="{ borderColor: color }" class="loader" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Loader',
    props: {
        color: {
            type: String,
            default: 'white',
        },
    },
});
</script>

<style scoped lang="scss">
.loader {
    background-color: transparent;
    border: 5px solid;
    border-left-color:  rgba(white, 0) !important;
    border-radius: 50%;
    animation: rotation 1s infinite linear;
}

@keyframes rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
