<template>
    <el-space wrap class="box-content">
        <div v-for="i in list" :key="i.name" class="box-card" shadow="hover">
            <el-tooltip class="box-item" effect="dark" :content="i.name" placement="top">
                <el-image style="width: 80px; height: 80px" :src="i.icon" />
                <!-- <div class="box-name">名称</div> -->
            </el-tooltip>
        </div>
        <div class="box-card" @click="addItem">
            <el-button type="primary" circle>
                <el-icon>
                    <Plus />
                </el-icon>
            </el-button>
        </div>
    </el-space>
</template>

<script lang='ts' setup>
import type { ISoftware } from "@/interfaces";

const emit = defineEmits(['update:list'])

const props = defineProps({
    list: {
        type: Array<ISoftware>,
        default: () => [],
    },
    active: {
        type: Number,
        default: 0
    }
})

const addItem = async () => {
    window.ipcRenderer.invoke('dialog:openFile').then(file => {
        console.log(file);
        if (file) {
            const list = [...props.list]
            list.push(...file)
            emit('update:list', list)
        }
    })
}

</script>

<style lang="scss" scoped>
.box-content {
    padding: 12px;
}

.box-card {
    cursor: pointer;
    transition-duration: 0.3s;
    padding: 10px;
    min-width: 80px;
    min-height: 80px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &:hover {
        transform: scale(1.2);
    }

    .box-item {
        width: 110px;
        margin-top: 40px;
    }

    .box-name {
        text-align: center;
        line-height: 30px;
    }
}
</style>