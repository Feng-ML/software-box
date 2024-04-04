<template>
    <div class="software-box" @drop="handleDrop" @dragover="handleDragOver">
        <div class="box-content" ref="boxContentRef">
            <div v-for="i in list" :key="i.id" class="box-card">
                <el-popconfirm title="确定删除吗?" @confirm.stop="deleteItem(i.id)">
                    <template #reference>
                        <el-icon class="delete-btn" size="25">
                            <RemoveFilled />
                        </el-icon>
                    </template>
                </el-popconfirm>
                <el-tooltip class="box-item" effect="dark" :content="i.name" placement="top">
                    <el-image style="width: 80px; height: 80px" :src="i.icon" />
                    <!-- <div class="box-name">名称</div> -->
                </el-tooltip>
            </div>
        </div>
        <div class="btn-group">
            <div class="btn">
                <el-button type="primary" circle @click="selectFile">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-button>
            </div>
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

const deleteItem = (id: string) => {
    const list = [...props.list]
    const index = list.findIndex(item => item.id === id)
    list.splice(index, 1)
    emit('update:list', list)
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

// item基础样式
.card-default {
    transition-duration: 0.3s;
    padding: 10px;
    width: 80px;
    height: 80px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.box-card {
    cursor: pointer;
    @extend .card-default;
    position: relative;

    .el-image:hover {
        transition-duration: 0.3s;
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

    .delete-btn {
        color: var(--el-color-danger);
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 1;
    }
}

.sortable-drag {
    transform: scale(1);
}

.sortable-ghost {
    border: 2px dashed var(--el-color-primary);
    opacity: 0.5;
}

.btn-group {
    display: flex;
    align-items: center;

    .btn {
        @extend .card-default;
    }
}
</style>