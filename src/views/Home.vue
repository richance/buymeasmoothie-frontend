<template>
    <div :class="{ 'home_send': !isSmoothieTeam }" class="home">
        <Header />

        <main class="home__main">
            <template v-if="!currentAddress">
                <span v-if="!isSmoothieTeam" class="home__donateDescription">
                    <span class="donateDescription__donateFor">
                        Donate for
                    </span>
                    <span class="donateDescription__donateName">
                        {{ donateText }}
                    </span>
                    <a :href="addressLink" target="_blank" class="donateDescription__donateAddress">
                        {{ shortAddress }}
                    </a>
                </span>
                <span v-else class="home__description">
                    Buy Me a Smoothie is a simple and fast way to get & send kudos (a.k.a. donations) in crypto.
                </span>

                <div class="home__choose">
                    <div class="home__chooseInner">
                        <div v-if="isSmoothieTeam" class="home__chooseTitle">
                            <span class="home__title">
                                To SEND kudos
                            </span>
                            <span class="home__caption">
                                You need Ethereum wallet
                            </span>
                        </div>

                        <RouterLink :to="{ name: 'Connect' }" class="home__connectWallet">
                            <div class="home__addContainer">
                                <i class="icon-plus" />
                            </div>

                            <span class="choose__title">
                                Connect Wallet
                            </span>
                        </RouterLink>
                    </div>

                    <div class="home__chooseInner">
                        <div v-if="isSmoothieTeam" class="home__chooseTitle">
                            <span class="home__title">
                                To GET kudos
                            </span>
                            <span class="home__caption">
                                It’s takes less than a minute
                            </span>
                        </div>

                        <a href="https://t.me/buymeasmoothie_bot" target="_blank" class="home__donationForm">
                            <img src="/money.png" alt="money" class="home__money">

                            <span class="choose__title">
                                <template v-if="!isSmoothieTeam">
                                    You also can get kudos
                                    <br>
                                </template>
                                Create Donation Form
                            </span>
                        </a>
                    </div>
                </div>
            </template>

            <template v-else>
                <InfoModal v-if="!isLoading && !isChainCorrect" />
                <SendForm class="home__sendForm" />
            </template>
        </main>

        <footer class="home__footer">
            <a href="https://medium.com/@buymeasmoothie/how-to-use-108f5fd31a34" target="_blank" class="footer__socialLink">
                How to use it?
            </a>

            <a href="https://t.me/buymeasmoothie_bot" target="_blank" class="footer__socialLink">
                Telegram Bot
            </a>

            <a href="https://t.me/buymeasmoothie" target="_blank" class="footer__socialLink">
                Telegram
            </a>

            <a href="https://twitter.com/buymeasmoothie" target="_blank" class="footer__socialLink">
                Twitter
            </a>
        </footer>
    </div>
</template>

<script lang="ts">
import { computed, watchEffect, defineComponent, ref } from 'vue';
import Header from '@/components/Header.vue';
import { useStore } from 'vuex';
import SendForm from '@/components/SendForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { DONATE_ID, USER_ID } from '@/consts/sessionStorage';
import { SMOOTHIE_DONATE_ID, SMOOTHIE_USER_ID } from '@/consts/common';
import { ActionTypes } from '@/store/actions';
import getShortAddress from '@/utils/getShortAddress';
import { getScanLink } from '@/utils/getScanAddressLink';
import { ETH_NETWORK_ID } from '@/consts/networkIds';
import InfoModal from '@/components/modals/InfoModal.vue';

export default defineComponent({
    name: 'Home',
    components: {
        InfoModal,
        Header,
        SendForm,
    },
    setup() {
        const { state, dispatch } = useStore();
        const route = useRoute();
        const router = useRouter();

        const isLoading = ref(false);

        const currentAddress = computed(() => state.address);
        const chainId = computed(() => state.chainId);
        const goal = computed(() => state.goal);
        const addressLink = computed(() => getScanLink(goal.value.address, donateChain.value));
        const donateText = computed(() => state.goal?.name ?? '');
        const donateChain = computed(() => state.goal?.chain ?? 0);
        const shortAddress = computed(() => getShortAddress(goal.value.address ?? ''));
        const isChainCorrect = computed(() => state.goal?.chain === chainId.value);

        const userId = route.query.user_id ?? sessionStorage.getItem(USER_ID);
        const donateId = route.query.donate_id ?? sessionStorage.getItem(DONATE_ID);

        if (userId && donateId) {
            sessionStorage.setItem(USER_ID, userId as string);
            sessionStorage.setItem(DONATE_ID, donateId as string);
        } else {
            sessionStorage.setItem(USER_ID, SMOOTHIE_USER_ID);
            sessionStorage.setItem(DONATE_ID, SMOOTHIE_DONATE_ID[chainId.value] ?? SMOOTHIE_DONATE_ID[ETH_NETWORK_ID]);
        }

        const getGoal = async (userId: string, donateId: string) => {
            const goal = await dispatch(ActionTypes.getGoal, {
                userId,
                donateId,
            });

            if (goal.status === 404) {
                router.replace({ name: 'DonateNotFound' });
                sessionStorage.removeItem(USER_ID);
                sessionStorage.removeItem(DONATE_ID);
            }
        };

        watchEffect(async () => {
            if (sessionStorage.getItem(USER_ID) === SMOOTHIE_USER_ID) {
                const smoothieDonateId = SMOOTHIE_DONATE_ID[chainId.value]  ?? SMOOTHIE_DONATE_ID[ETH_NETWORK_ID];

                sessionStorage.setItem(DONATE_ID, smoothieDonateId);
            }

            isLoading.value = true;
            await getGoal(sessionStorage.getItem(USER_ID) as string, sessionStorage.getItem(DONATE_ID) as string);
            isLoading.value = false;
        });

        const isSmoothieTeam = sessionStorage.getItem(USER_ID) === SMOOTHIE_USER_ID;

        return {
            currentAddress,
            shortAddress,
            donateText,
            addressLink,
            isSmoothieTeam,
            isChainCorrect,
            isLoading,
        };
    }
});
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: white;
}

.home__main {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 16px;
    flex-grow: 1;
}

.home__description {
    font-size: 28px;
    text-align: center;
    line-height: 1.4;
    max-width: 380px;
    align-self: center;
}

.home__donateDescription {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 380px;
    align-self: center;
}

.donateDescription__donateFor {
    font-size: 18px;
    line-height: 1.5;
}

.donateDescription__donateName {
    font-weight: 900;
    font-size: 28px;
    line-height: 1.5;
    font-style: normal;
    margin-top: 9px;
}

.donateDescription__donateAddress {
    font-size: 18px;
    line-height: 1.5;
}

.home__choose {
    display: flex;
    justify-content: center;
    margin: auto 0;
}

.home__chooseInner {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.home__chooseInner:not(:first-child) {
    margin-left: 46px;
}

.home__chooseTitle {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 17px;
}

.home__title {
    font-weight: 900;
    font-size: 20px;
    line-height: 1.5;
    font-style: normal;
}

.home__caption {
    font-size: 16px;
    line-height: 1.5;
    color: #8F8F8F;
}

.home__connectWallet,
.home__donationForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 343px;
    min-width: 343px;
    min-height: 404px;
    border-radius: 16px;
    padding: 60px 0;
}

.home__sendForm {
    margin: auto 0;
    align-self: center;
}

.home__connectWallet {
    background-image: linear-gradient(339deg, #FBAB7E 33%, #FFC6A6 111%);
}

.home__donationForm {
    background-color: #492073;
}

.home__addContainer,
.home__money {
    margin: auto 0;
    width: 180px;
}

.home__money {
    max-width: 180px;
    padding-top: 32px;
}

.home_send {
    .home__choose {
        flex-direction: column;
        margin-top: 40px;
    }

    .home__donationForm {
        padding-bottom: 20px;
        padding-top: 36px;
        height: 161px;
        min-height: initial;

        .choose__title {
            font-size: 13px;
        }
    }

    .home__money {
        padding-top: 0;
        max-width: 73px;
    }

    .home__chooseInner:not(:first-child) {
        margin-left: 0;
        margin-top: 16px;
        margin-bottom: 80px;
    }
}

.home__addContainer {
    position: relative;
    height: 180px;
    border: 11px solid rgba(white, 0.3);
    border-radius: 50%;

    .icon-plus {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 75px;
    }
}

.choose__title {
    color: white;
    font-size: 24px;
    line-height: 1.5;
    margin-top: auto;
    font-weight: bold;
    font-style: normal;
}

.home__footer {
    display: flex;
    margin-top: 32px;
    padding-bottom: 24px;
}

.footer__socialLink {
    position: relative;
    color: #8F8F8F;
    line-height: 1.5;
    font-style: normal;
    font-size: 13px;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: -3px;
        height: 1px;
        width: 100%;
        background-color: #8F8F8F;
        opacity: 0.3;
    }

    &:not(:first-child) {
        margin-left: 16px;
    }
}

@media screen and (max-width: 900px) {
    .home__chooseInner {
        width: 100%;
    }

    .home__donationForm,
    .home__connectWallet {
        min-width: initial;
    }
}

@media screen and (max-width: 600px) {
    .home__chooseInner:not(:first-child) {
        margin-left: 0;
        margin-top: 50px;
        margin-bottom: 50px;
    }

    .home__choose {
        flex-direction: column;
        margin-top: 50px;
    }

    .home_send {
        .home__chooseInner:not(:first-child) {
            margin-top: 10px;
        }
    }
}

@media screen and (max-width: 420px) {
    .home__description {
        font-size: 22px;
    }
}

@media screen and (max-width: 350px) {
    .home__main {
        padding-top: 8px;
    }
}
</style>
