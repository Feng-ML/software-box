<template>
    <div class="software-box" @drop="handleDrop" @dragover="handleDragOver">
        <ToolBar title="软件" v-model:is-edit="isEdit" :showBtns="!isDesktop && hasMenu" searchBtn
            @add="selectFile('file')" @search="searchSoft" />

        <div class="empty" v-if="!list.length">
            <div v-if="isDesktop">请在主页面添加软件</div>
            <div v-else-if="hasMenu">请通过文件拖拽或点击右上角按钮添加软件</div>
            <div v-else>请先新增分组</div>
        </div>

        <div class="box-content" ref="boxContentRef">
            <div v-for="i in softList" :key="i.id" class="box-card" @contextmenu="handleContextMenu(i)">
                <el-popconfirm title="确定删除吗?" @confirm.stop="deleteItem(i.id)">
                    <template #reference>
                        <el-icon v-show="isEdit" class="delete-btn" size="20">
                            <RemoveFilled />
                        </el-icon>
                    </template>
                </el-popconfirm>
                <el-tooltip class="box-item" :content="i.name" placement="top">
                    <el-image draggable="false" style="width: 100%; height: 100%" :src="i.icon"
                        @click="openFile(i.path)" />
                    <!-- <div class="box-name">名称</div> -->
                </el-tooltip>
            </div>
            <!-- <div v-for="i in 150" class="box-card"><el-image style="width: 100%; height: 100%" /></div> -->
        </div>

        <BasicDialog title="图标设置" v-model="dialogVisible" width="500" @submit="formSubmit">
            <template #content>
                <el-form ref="formRef" :model="formData" :rules="formRules" label-width="auto">
                    <div class="img-is-select" @click="imgSelect">
                        <img v-if="formData.icon" :src="formData.icon" />
                        <img v-else src="@/assets/images/Bartender.png" alt="">
                    </div>

                    <el-form-item label="名称" prop="name">
                        <el-input v-model="formData.name" placeholder="请输入图标名称" />
                    </el-form-item>
                    <el-form-item label="路径" prop="path">
                        <div class="flex-center">
                            <el-input v-model="formData.path" placeholder="请输入启动路径" />
                            <el-button type="primary" @click="selectFile('path')">选择路径</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </template>
        </BasicDialog>
    </div>
</template>

<script lang='ts' setup>
import { onMounted, ref, watch, inject, computed, watchEffect, reactive, toRaw } from 'vue';
import type { ISoftware } from "@/interfaces";
import Sortable from 'sortablejs';
import ToolBar from '@/components/ToolBar.vue';
import { throttle } from '@/utils/common';
import BasicDialog from '@/components/BasicDialog.vue'
import type { IFormConfigItem } from '@/components/BasicDialog.vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus'

// 桌面组件
const isDesktop = inject('isDesktop')

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

const selectFile = async (type: string) => {
    const options = {
        type,
        filters: [
            { name: 'software', extensions: ['exe', 'lnk', 'bat', 'vbs', 'url'] }
        ]
    }
    window.ipcRenderer.invoke('dialog:openFile', options).then(file => {
        console.log(file);
        if (!file) return

        if (type === 'path') formData.path = file[0]
        if (type === 'file') addItem(file)

    })
}

// 移入文件保存
const handleDrop = (e: any) => {
    e.preventDefault()

    const { files, types } = e.dataTransfer;
    console.log(files, types);

    const fileList = Array.from(files);
    if (!fileList.length) return

    const filePaths = fileList.map((file: any) => file.path)
    window.ipcRenderer.invoke('drag-file-into', filePaths).then(files => {
        if (files && files.length) {
            addItem(files)
        }
    })

}

const handleDragOver = (e: any) => {
    e.preventDefault()
}

// 修改
const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const formData: {
    id: string,
    name: string,
    path: string,
    icon: string,
} = reactive({
    id: '',
    name: '',
    path: '',
    icon: '',
})
const formRules = {
    name: [
        { required: true, message: '图标名称不能为空', trigger: 'blur' },
    ],
    path: [
        { required: true, message: '启动路径不能为空', trigger: 'blur' },
    ],
}

// 图片选择
const imgSelect = () => {
    const options = {
        type: 'image',
        filters: [
            { name: 'image', extensions: ['bmp', 'jpg', 'png', 'gif', 'ico', 'svg', 'jpeg'] },
        ]
    }
    window.ipcRenderer.invoke('dialog:openFile', options).then(files => {
        if (files) {
            const imgDetail = files[0]
            const isLt2M = imgDetail.info.size / 1024 / 1024 < 2;
            if (!isLt2M) return ElMessage.error('图片大小不能超过 2MB!');
            formData.icon = imgDetail.img.toDataURL()
        }
    })
}

const formSubmit = () => {
    const list = [...props.list]
    const index = list.findIndex(item => item.id === formData.id)
    list.splice(index, 1, toRaw(formData))
    emit('update:list', list)
    dialogVisible.value = false
}


// 删除
const deleteItem = (id: string) => {
    const list = [...props.list]
    const index = list.findIndex(item => item.id === id)
    list.splice(index, 1)
    emit('update:list', list)
}

const openFile = throttle(function (path: string) {
    if (isEdit.value) return
    window.ipcRenderer.send('open-file', path)
}, 1000)

// 右键菜单
let selectItem: ISoftware;
const handleContextMenu = (item: ISoftware) => {
    if (!isDesktop) {
        selectItem = item;
        window.ipcRenderer.send('show-context-menu')
    }
}
window.ipcRenderer.on('context-menu-command', (event: any, command: string) => {
    switch (command) {
        case '修改':
            formRef.value?.resetFields()
            Object.assign(formData, selectItem)
            dialogVisible.value = true
            break;
        case '删除':
            selectItem && deleteItem(selectItem.id)
            break;
        default:
            break;
    }
})

// 搜索
const searchValue = ref('')
const searchSoft = (value: string) => {
    searchValue.value = value
}
const softList = computed(() => {
    if (!searchValue.value) return props.list
    return props.list.filter(item => item.name.includes(searchValue.value))
})

// 排序拖拽组件
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

// 是否允许拖拽
watchEffect(() => {
    if (isEdit.value && !searchValue.value) {
        boxSortable?.option('disabled', false)
    } else {
        boxSortable?.option('disabled', true)
    }
})

</script>

<style lang="scss" scoped>
.software-box {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.box-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 20px 20px;
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
        cursor: pointer;
    }
}

.sortable-drag {
    transform: scale(1);
}

.sortable-ghost {
    border: 2px dashed var(--el-color-primary);
    opacity: 0.5;
}

.flex-center {
    flex-grow: 1;

    .el-button {
        margin-left: 12px;
    }
}

.img-is-select {
    width: 100px;
    height: 100px;
    overflow: hidden;
    cursor: pointer;
    margin: auto;
    margin-bottom: 20px;

    img {
        width: 100%;
    }
}
</style>