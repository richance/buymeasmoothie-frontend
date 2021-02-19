<template>
    <button :class="{ 'selectListItemLayout_selected': selected }" class="selectListItemLayout">
        <slot />
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SelectListItemLayout',
    props: {
        selected: {
            type: Boolean,
            default: false,
        },
    },
});
</script>

<style scoped lang="scss">
.selectListItemLayout {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 163px;
    height: 163px;
    border-radius: 16px;
    padding: 12px;
    background-color: white;
    color: black;
    cursor: pointer;
    font-size: 16px;
    font-style: italic;
    border: 1px solid white;

    &:hover {
        border-color: rgb(33, 114, 229);
    }
}

.selectListItemLayout_selected {
    border-color: green;
}

@media screen and (max-width: 350px) {
    .selectListItemLayout {
        width: 140px;
        height: 140px;
    }
}
</style>
