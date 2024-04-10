<template>
    <div class="software-box" @drop="handleDrop" @dragover="handleDragOver">
        <ToolBar title="软件" v-model:is-edit="isEdit" :showBtns="hasMenu" @add="selectFile" />

        <div class="empty" v-if="!list.length">
            <div v-if="hasMenu">请通过文件拖拽或点击右上角按钮添加软件</div>
            <div v-else>请先新增分类</div>
        </div>

        <div class="box-content" ref="boxContentRef">
            <div v-for="i in list" :key="i.id" class="box-card">
                <el-popconfirm title="确定删除吗?" @confirm.stop="deleteItem(i.id)">
                    <template #reference>
                        <el-icon v-show="isEdit" class="delete-btn" size="20">
                            <RemoveFilled />
                        </el-icon>
                    </template>
                </el-popconfirm>
                <el-tooltip class="box-item" effect="dark" :content="i.name" placement="top">
                    <el-image draggable="false" style="width: 100%; height: 100%" :src="i.icon"
                        @click="openFile(i.path)" />
                    <!-- <div class="box-name">名称</div> -->
                </el-tooltip>
            </div>
        </div>

    </div>
</template>

<script lang='ts' setup>
import { onMounted, ref, watch } from 'vue';
import type { ISoftware } from "@/interfaces";
import Sortable from 'sortablejs';
import ToolBar from '@/components/ToolBar.vue';
import { ElMessage } from 'element-plus';
import { throttle } from '@/utils/common';

const emit = defineEmits(['update:list'])
const boxContentRef = ref()
const isEdit = ref(false)

const props = defineProps({
    list: {
        type: Array<ISoftware>,
        default: () => [],
    },
    hasMenu: {
        type: Boolean,
        default: false,
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

    const { files, types } = e.dataTransfer;
    console.log(files, types);

    const fileList = Array.from(files);
    if (!fileList.length) return
    if (types[0] !== 'Files') return ElMessage.error('只能添加exe、lnk文件！')
    const canAddFileList = fileList.filter((file: any) => /\.(exe|lnk)$/i.test(file.name))
    if (canAddFileList.length < fileList.length) ElMessage.warning('只能添加exe、lnk文件！')
    if (!canAddFileList.length) return

    const filePaths = canAddFileList.map((file: any) => file.path)
    window.ipcRenderer.invoke('drag-file-into', filePaths).then(files => {
        if (files) {
            addItem(files)
        }
    })

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

const openFile = throttle(function (path: string) {
    window.ipcRenderer.send('open-file', path)
}, 1000)

let boxSortable: any;
onMounted(() => {
    boxSortable = Sortable.create(boxContentRef.value, {
        // group: 'menu',
        animation: 250,
        ghostClass: "sortable-ghost", //放置占位符的类名
        dragClass: "sortable-drag", //所选项目的类名
        // filter: '.not-sort', // 禁用拖拽的类名
        disabled: true,

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

watch(isEdit, () => {
    if (isEdit.value) {
        boxSortable.option('disabled', false)
    } else {
        boxSortable.option('disabled', true)
    }
})

</script>

<style lang="scss" scoped>
.software-box {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.box-content {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px;
}

// item基础样式
.card-default {
    transition-duration: 0.3s;
    width: 50px;
    height: 50px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.box-card {
    @extend .card-default;
    position: relative;

    .el-image:hover {
        cursor: pointer;
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
        top: -5px;
        right: -5px;
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
</style>