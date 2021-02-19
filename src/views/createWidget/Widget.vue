<template>
    <div class="widget">
        <Header />

        <main class="widget__main">
            <div class="widget__previewContainer">
                <div class="widget__preview">

                </div>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/Header.vue';

export default defineComponent({
    name: 'Widget',
    components: { Header },
    setup() {
        const route = useRoute();


        const { donate_id, user_id } = route.params;


    }
});
</script>

<style scoped lang="scss">
.widget__main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 750px;
    padding: 16px;
    margin: auto;
}

.widget__previewContainer {
    width: 100%;
    border-radius: 16px;
    height: 300px;
    border: 1px solid black;
    background-color: #424242;
}
</style>
