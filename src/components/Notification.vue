<template>
    <Teleport to="body">
        <div v-if="popupInfo" :key="popupInfo" id="notification" class="notification" @click="closeModal">
            <div class="notification__close">
                <i class="icon-close" />
            </div>

            <div class="notification__content">
                {{ popupInfo.msg }}
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { IPopupInfo } from '@/store/mutations';
import useNotification from '@/hooks/useNotification';

export default defineComponent({
    name: 'Notification',
    setup() {
        const timer = ref<number | null>(null);
        const { state } = useStore();
        const { closeNotify } = useNotification();

        const popupInfo = computed<IPopupInfo>(() => state.popupInfo);

        watch(popupInfo, (info) => {
            clearTimeout(timer.value as number);

            if (info) {
                timer.value = setTimeout(closeNotify, info.duration);
            }
        });

        return {
            closeNotify,
            popupInfo,
        };
    },
});
</script>

<style scoped lang="scss">
.notification {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px;
    width: 370px;
    height: 100px;
    background-color: white;
    box-sizing: border-box;
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    z-index: 2;
}

.notification__content {
    font-size: 20px;
}
</style>
