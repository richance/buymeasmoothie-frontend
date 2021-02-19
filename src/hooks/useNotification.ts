import { computed } from 'vue';
import { useStore } from 'vuex';
import { IPopupInfo, MutationType } from '@/store/mutations';

const useNotification = () => {
    const { commit, state } = useStore();
    const popupInfo = computed<IPopupInfo>(() => state.popupInfo);
    const isShown = computed(() => Boolean(popupInfo));

    const notify = (popupInfo: IPopupInfo) => {
        commit(MutationType.setPopupInfo, popupInfo);
    };

    const closeNotify = () => {
        commit(MutationType.setPopupInfo, null);
    };

    return {
        isShown,
        notify,
        closeNotify,
    };
};

export default useNotification;
