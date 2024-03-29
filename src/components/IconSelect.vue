<template>
    <el-dialog v-model="dialogVisible" title="选择图标" width="545">
        <div class="icon-box">
            <div class="icon-item" v-for="item in iconNames" :key="item" @click="selectIcon(item)">
                <el-icon>
                    <component :is="item" />
                </el-icon>
            </div>
        </div>
    </el-dialog>
</template>

<script lang='ts' setup>
import { iconNames } from '@/main.ts'
import { ref } from 'vue';

const emit = defineEmits(['select'])
const dialogVisible = ref(false)

const show = () => {
    dialogVisible.value = true
}

const selectIcon = (icon: string) => {
    emit('select', icon)
    dialogVisible.value = false
}

defineExpose({
    show
})
</script>

<style lang="scss" scoped>
.icon-box {
    display: flex;
    flex-wrap: wrap;

    .icon-item {
        padding: 10px;

        &:hover {
            cursor: pointer;
            background-color: #eee;
            color: var(--el-color-primary);
        }
    }

}
</style>