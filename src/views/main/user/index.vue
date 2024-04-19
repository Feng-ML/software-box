<template>
    <div class="user-page">
        <el-menu default-active="0" class="el-menu" @select="selectMenu">

            <div class="menu-content" ref="elMenuRef">
                <el-menu-item v-for="(item, index) in menuList" :key="index" :index="index + ''">
                    <el-icon>
                        <component :is="item.icon" />
                    </el-icon>
                    <div class="menu-item-name">{{ item.name }}</div>
                </el-menu-item>
            </div>
        </el-menu>

        <RouterView />
    </div>
</template>

<script lang='ts' setup>
import { RouterView, useRouter } from 'vue-router';

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

const selectMenu = (index: string) => {
    const path = menuList[Number(index)].path
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

.el-menu {
    flex-shrink: 0;
}
</style>