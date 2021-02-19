<template>
    <div class="modal" @click="closeModal">
        <div class="modal__content" @click.stop>
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Modal',
    props: {
        isOpen: Boolean,
    },
    setup(props, { emit }) {
        const closeModal = () => emit('close', false);

        return {
            closeModal,
        };
    },
});
</script>

<style scoped lang="scss">
.modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(white, 0.6);
    z-index: 4;
}

.modal__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 90%;
}

.modal__content::-webkit-scrollbar {
    width: 0;
    display: none;
}
</style>
