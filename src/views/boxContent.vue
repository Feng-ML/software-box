<template>
    <div class="software-box" @drop="handleDrop" @dragover="handleDragOver">
        <div class="box-content" ref="boxContentRef">
            <div v-for="i in list" :key="i.id" class="box-card" shadow="hover">
                <el-tooltip class="box-item" effect="dark" :content="i.name" placement="top">
                    <el-image style="width: 80px; height: 80px" :src="i.icon" />
                    <!-- <div class="box-name">名称</div> -->
                </el-tooltip>
            </div>
        </div>
        <div class="add-btn" @click="selectFile">
            <el-button type="primary" circle>
                <el-icon>
                    <Plus />
                </el-icon>
            </el-button>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { onMounted, ref, watchEffect } from 'vue';
import type { ISoftware } from "@/interfaces";
import Sortable from 'sortablejs';

const emit = defineEmits(['update:list'])
const boxContentRef = ref()

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

const addItem = (file: any) => {
    const list = [...props.list]
    if (Array.isArray(file)) {
        list.push(...file)
    } else {
        list.push(file)
    }
    emit('update:list', list)

}

const selectFile = async () => {
    window.ipcRenderer.invoke('dialog:openFile').then(file => {
        console.log(file);
        if (file) {
            addItem(file)
        }
    })
}

// 移入文件保存
const handleDrop = (e: any) => {
    e.preventDefault()

    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
        const filePaths = files.map((file: any) => file.path)
        window.ipcRenderer.invoke('drag-file-into', filePaths).then(files => {
            if (files) {
                addItem(files)
            }
        })
    }
}

const handleDragOver = (e: any) => {
    e.preventDefault()
}

onMounted(() => {
    Sortable.create(boxContentRef.value, {
        // group: 'menu',
        animation: 250,
        ghostClass: "sortable-ghost", //放置占位符的类名
        dragClass: "sortable-drag", //所选项目的类名
        // filter: '.not-sort', // 禁用拖拽的类名

        onEnd: (evt: any) => {
            const { oldIndex, newIndex } = evt;
            const list = [...props.list]

            // 交换位置
            if (newIndex !== oldIndex) {
                const old = list.splice(oldIndex, 1)[0]
                list.splice(newIndex, 0, old)
                emit('update:list', list)
            }
        }
    })
})

</script>

<style lang="scss" scoped>
.software-box {
    height: 100%;
}

.box-content {
    display: flex;
    flex-wrap: wrap;
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

.sortable-drag {
    transform: scale(1);
}

.sortable-ghost {
    border: 2px dashed var(--el-color-primary);
    opacity: 0.5;
}

.add-btn {
    cursor: pointer;
    display: inline-block;
    transition-duration: 0.3s;
    padding: 10px;
    min-width: 80px;
    min-height: 80px;
    text-align: center;
    line-height: 80px;
}
</style>