<template>
    <div class="user-page">
        <BasicMenu :list="menuList" @menuClick="selectMenu" />

        <div class="user-content">
            <RouterView />
        </div>
    </div>
</template>

<script lang='ts' setup>
import { RouterView, useRouter } from 'vue-router';
import BasicMenu from '@/components/BasicMenu.vue';

const router = useRouter()
const menuList = [
    {
        name: '设置',
        icon: 'Tools',
        path: '/user/setting'
    },
    {
        name: '全局快捷键',
        icon: 'Key',
    }
]

const selectMenu = (index: number) => {
    const path = menuList[index].path
    if (path) {
        router.push(path)
    }
}
</script>

<style lang="scss" scoped>
.user-page {
    height: 100%;
    display: flex;
}

.user-content {
    flex: 1;
    padding: 12px;
    padding-left: 0;
}
</style>