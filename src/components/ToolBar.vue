<template>
    <div class="tool-bar">
        <div>{{ title }}</div>

        <div v-if="showBtns">
            <div v-if="!isEdit" class="btns">
                <el-icon title="设置" size="20" @click="isEdit = !isEdit">
                    <Tools />
                </el-icon>
            </div>
            <div v-else class="btns">
                <el-icon class="main-color" size="20" @click="addClick" title="添加">
                    <CirclePlusFilled />
                </el-icon>
                <el-icon class="success-color" size="20" title="完成" @click="isEdit = !isEdit">
                    <Select />
                </el-icon>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
const emit = defineEmits(['add'])
const isEdit = defineModel<boolean>('isEdit')
defineProps({
    title: String,
    showBtns: {
        type: Boolean,
        default: true
    }
})

const addClick = () => {
    emit('add')
}
</script>

<style lang="scss" scoped>
.tool-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;

    .btns {
        text-align: right;
        display: flex;
        align-items: center;

        .el-icon {
            margin-left: 10px;
            cursor: pointer;
        }
    }
}
</style>