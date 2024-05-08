<template>
  <div class="card software-box" @drop="handleDrop" @dragover="handleDragOver">
    <ToolBar
      title=""
      v-model:isEdit="isEdit"
      v-model:activeIndex="activeIndex"
      :showBtns="!isDesktop && categoryList.length != 0"
      :list="categoryList"
      @add="selectFile('file')"
      @search="searchSoft"
      @addTag="addCategory"
      @editTag="editCategory"
      @deleteTag="deleteCategory"
      @sortTag="sortCategory"
    />

    <div class="empty" v-if="!softList || !softList.length">
      <div v-if="isDesktop">请在主页面添加软件</div>
      <div v-else-if="categoryList.length">请通过文件拖拽或点击右上角按钮添加软件</div>
      <div v-else>请先新增分组</div>
    </div>

    <Draggable
      v-model="softList"
      item-key="id"
      class="box-content"
      :style="{ '--software-size': 0.5 * setting.softwareSize + 'px' }"
      :disabled="sortDisable"
      :animation="200"
      @start="startSortSoftList"
      @end="sortSoftList"
    >
      <template #item="{ element, index }">
        <div class="box-card" :class="{ isSorting }" @contextmenu="handleContextMenu(element)">
          <el-icon
            v-show="isEdit"
            class="delete-btn"
            size="20"
            @click.stop="deleteItem(element.id)"
          >
            <RemoveFilled />
          </el-icon>
          <el-tooltip
            :content="element.name"
            placement="top"
            :disabled="isSorting || !setting.isShowSoftwareNameTooltip"
          >
            <el-image draggable="false" :src="element.icon" @click="openFile(element.path)" />
          </el-tooltip>
          <div v-if="setting.isShowSoftwareName" class="box-name">{{ element.name }}</div>
        </div>
      </template>
    </Draggable>
    <!-- <div v-for="i in 150" class="box-card"><el-image style="width: 100%; height: 100%" /></div> -->

    <BasicDialog title="图标设置" v-model="dialogVisible" width="500" @submit="formSubmit(formRef)">
      <template #content>
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="auto">
          <div class="img-is-select" @click="imgSelect">
            <img v-if="formData.icon" :src="formData.icon" />
            <img v-else src="@/assets/images/Bartender.png" alt="" />
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

<script lang="ts" setup>
import { ref, computed, watchEffect, reactive, toRaw, provide, shallowRef, watch } from 'vue'
import { throttle, generateRandomId } from '@/utils/common'
import { ElMessage } from 'element-plus'
import settingStore from '@/stores/setting'

import type { ICategoryItem, ISoftware } from '@/interfaces'
import type { FormInstance } from 'element-plus'

import BasicDialog from '@/components/BasicDialog.vue'
import ToolBar from './ToolBar.vue'
import Draggable from 'vuedraggable'
import { RemoveFilled } from '@element-plus/icons-vue'

const setting = settingStore().setting
// 是否为桌面组件
const props = defineProps({
  isDesktop: Boolean
})
provide('isDesktop', props.isDesktop)

const emit = defineEmits(['update:list'])
const isEdit = ref(false)

const categoryList = ref<ICategoryItem[]>([])
const softwareList = computed(() => categoryList.value[activeIndex.value]?.softwareList)
const activeIndex = ref(0)

// 获取数据
window.ipcRenderer.invoke('get-category-list').then((data: ICategoryItem[]) => {
  if (data && Array.isArray(data) && data.length) {
    categoryList.value = data
  }
})

// 保存数据
const saveData = () => window.ipcRenderer.send('set-category-list', toRaw(categoryList.value))

// 刷新软件悬浮框
window.ipcRenderer.on('refresh-page', (event) => {
  location.reload()
})

// 新增分组
const addCategory = (name: string) => {
  categoryList.value.push({
    id: generateRandomId(20),
    name,
    softwareList: []
  })
  saveData()
}

// 编辑分组
const editCategory = (index: number, name: string) => {
  categoryList.value[index].name = name
  saveData()
}

// 删除分组
const deleteCategory = (index: number) => {
  categoryList.value.splice(index, 1)
  saveData()

  if (index === activeIndex.value) {
    activeIndex.value = 0
  }
  if (activeIndex.value > index) {
    activeIndex.value--
  }
}

// 排序分组
const sortCategory = (list: ICategoryItem[]) => {
  const selectId = categoryList.value[activeIndex.value].id
  const newSelectIndex = list.findIndex((item) => item.id === selectId)

  categoryList.value = list
  activeIndex.value = newSelectIndex
  saveData()
}

// 图标搜索
const searchValue = ref('')
const searchSoft = (value: string) => {
  searchValue.value = value
  searchSoftList()
}
const searchSoftList = () => {
  if (searchValue.value) {
    softList.value = toRaw(softwareList.value).filter((item) =>
      item.name.toLowerCase().includes(searchValue.value.toLowerCase())
    )
  } else {
    softList.value = toRaw(softwareList.value)
  }
}

// 图标列表
const softList = ref<ISoftware[]>([])
watch(softwareList, () => (softList.value = toRaw(softwareList.value)))

// 图标排序
const sortDisable = computed(() => props.isDesktop || searchValue.value)
const isSorting = ref(false)
const startSortSoftList = () => {
  isSorting.value = true
}
const sortSoftList = () => {
  categoryList.value[activeIndex.value].softwareList = toRaw(softList.value).map((item) =>
    toRaw(item)
  )
  saveData()
  isSorting.value = false
}

// 添加图标
const addItem = (file: any[]) => {
  const list = softwareList.value
  list.push(...file)
  saveData()
  searchSoftList()
}

const selectFile = async (type: string) => {
  const options = {
    type
    // filters: [{ name: 'software', extensions: ['exe', 'lnk', 'bat', 'vbs', 'url'] }]
  }
  window.ipcRenderer.invoke('dialog:openFile', options).then((file) => {
    console.log(file)
    if (!file) return

    if (type === 'path') formData.path = file[0]
    if (type === 'file') addItem(file)
  })
}

// 移入文件保存
const handleDrop = (e: any) => {
  e.preventDefault()

  const { files, types } = e.dataTransfer
  console.log(files, types)

  const fileList = Array.from(files)
  if (!fileList.length) return

  const filePaths = fileList.map((file: any) => file.path)
  window.ipcRenderer.invoke('drag-file-into', filePaths).then((files) => {
    if (files && files.length) {
      addItem(files)
    }
  })
}
const handleDragOver = (e: any) => {
  e.preventDefault()
}

// 修改图标
const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const formData: {
  id: string
  name: string
  path: string
  icon: string
} = reactive({
  id: '',
  name: '',
  path: '',
  icon: ''
})
const formRules = {
  name: [{ required: true, message: '图标名称不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '启动路径不能为空', trigger: 'blur' }]
}

// 图片选择
const imgSelect = () => {
  const options = {
    type: 'image',
    filters: [
      {
        name: 'image',
        extensions: ['bmp', 'jpg', 'png', 'gif', 'ico', 'svg', 'jpeg']
      }
    ]
  }
  window.ipcRenderer.invoke('dialog:openFile', options).then((files) => {
    if (files) {
      const imgDetail = files[0]
      const isLt2M = imgDetail.info.size / 1024 / 1024 < 2
      if (!isLt2M) return ElMessage.error('图片大小不能超过 2MB!')
      formData.icon = imgDetail.img.toDataURL()
    }
  })
}

const formSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate((valid, fields) => {
    if (valid) {
      const list = softwareList.value
      const index = list.findIndex((item) => item.id === formData.id)
      list.splice(index, 1, toRaw(formData))
      saveData()
      searchSoftList()
      dialogVisible.value = false
    }
  })
}

// 删除图标
const deleteItem = (id: string) => {
  const list = softwareList.value
  const index = list.findIndex((item) => item.id === id)
  list.splice(index, 1)
  saveData()
  searchSoftList()
}

// 点击打开软件
const openFile = throttle(function (path: string) {
  if (isEdit.value) return
  window.ipcRenderer.send('open-file', path)
}, 1000)

// 右键菜单
let selectItem: ISoftware
const handleContextMenu = (item: ISoftware) => {
  if (!props.isDesktop) {
    selectItem = item
    const menuList = [
      { label: '图标设置', value: 'icon-set' },
      { label: '图标删除', value: 'icon-delete' }
    ]
    window.ipcRenderer.send('show-context-menu', menuList)
  }
}
window.ipcRenderer.on('context-menu-command', (event: any, command: string) => {
  switch (command) {
    case 'icon-set':
      formRef.value?.resetFields()
      Object.assign(formData, selectItem)
      dialogVisible.value = true
      break
    case 'icon-delete':
      selectItem && deleteItem(selectItem.id)
      break
    default:
      break
  }
})
</script>

<style lang="scss" scoped>
.software-box {
  --software-size: 50px;

  flex: 1;
  margin: 12px 12px 12px 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100% - 24px);
}

.box-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--software-size), 1fr));
  gap: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 20px 20px;
}

// item基础样式
.box-card {
  width: var(--software-size);
  height: var(--software-size);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  .el-image {
    cursor: pointer;
    width: 100%;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.4);
    }
  }

  &.isSorting .el-image:hover {
    transform: scale(1);
  }

  .box-name {
    width: 50px;
    overflow: hidden;
    text-align: center;
    font-size: 12px;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    margin-top: 6px;
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
