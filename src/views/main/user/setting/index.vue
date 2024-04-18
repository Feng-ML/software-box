<template>
    <div class="setting-page">
        <div class="setting-title">基本设置</div>
        <div class="setting-row">
            <span>开机启动</span>
            <el-switch v-model="setting.isStartup" />
        </div>
        <div class="setting-row">
            <span>主题</span>
            <el-segmented v-model="setting.theme" :options="options">
                <template #default="{ item }">
                    <div class="segmented-item">
                        <el-icon size="20">
                            <component :is="item.value" />
                        </el-icon>
                    </div>
                </template>
            </el-segmented>
        </div>
        <div class="setting-title">悬浮球</div>
        <div class="setting-row">
            <span>开启悬浮球</span>
            <el-switch v-model="setting.isBallShow" />
        </div>
        <div class="setting-row">
            <span>是否置顶</span>
            <el-switch v-model="setting.isBallAlwaysOnTop" />
        </div>
    </div>
</template>

<script lang='ts' setup>
import settingStore from '@/stores/setting';
import { ref } from 'vue';

const store = settingStore();

const setting = store.setting;
// console.log(isBallShow);

const options = [
    {
        label: 'Sunny',
        value: 'Sunny',
    },
    {
        label: 'Moon',
        value: 'Moon',
    },
]
</script>

<style lang="scss">
.setting-page {
    padding: 20px;
    width: 100%;

    .setting-title {
        font-size: var(--el-font-size-large);
        margin-bottom: 20px;
        margin-top: 40px;
        color: var(--el-color-primary);

        &:first-child {
            margin-top: 0px;
        }
    }

    .setting-row {
        margin-left: 20px;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--el-font-size-base);
    }

    .segmented-item {
        display: flex;
    }

    .el-segmented {
        --el-border-radius-base: 16px;
    }
}
</style>