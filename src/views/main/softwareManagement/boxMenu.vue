<template>
  <el-menu :default-active="activeIndex" class="el-menu" :collapse="isCollapse" @select="selectMenu">
    <ToolBar title="分组" v-model:is-edit="isEdit" :show-btns="!isDesktop" @add="openAddFormDialog()" />

    <div class="menu-content" ref="elMenuRef">
      <el-menu-item v-for="(item, index) in list" :key="item.id" :index="index + ''">
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <div class="menu-item-name">{{ item.name }}</div>

        <div class="menu-item-tool">
          <el-icon class="el-icon-edit" v-show="isEdit" @click="openAddFormDialog(index)" title="编辑">
            <Edit />
          </el-icon>
          <el-popconfirm title="确定删除吗?" @confirm.stop="deleteMenu(index)">
            <template #reference>
              <el-icon class="el-icon-delete" v-show="isEdit" title="删除">
                <RemoveFilled />
              </el-icon>
            </template>
          </el-popconfirm>
        </div>
      </el-menu-item>
    </div>
  </el-menu>

  <BasicDialog :title="formTitle" v-model="dialogVisible" :form-type="formType" :form-data="formData" width="400"
    :form-config="formConfig" @submit="formSubmit" />
</template>

<script lang="ts" setup>
import { onMounted, ref, toRaw, watch, nextTick, inject } from 'vue'
import { ElMessage } from 'element-plus'
import Sortable from 'sortablejs';

import BasicDialog from '@/components/BasicDialog.vue'
import type { IFormConfigItem } from '@/components/BasicDialog.vue';
import type { ICategoryItem } from "@/interfaces";
import { generateRandomId } from '@/utils/common'
import ToolBar from '@/components/ToolBar.vue';

const isDesktop = inject('isDesktop')
const emit = defineEmits(['update:list', 'selectMenu'])

const isCollapse = ref(false)
const elMenuRef = ref()

const props = defineProps({
  list: {
    type: Array<ICategoryItem>,
    default: () => [],
  }
})

let formData: object
let formType: string
let formTitle: string
let formConfig: IFormConfigItem[] = [
  {
    label: '分组名称',
    prop: 'name',
    type: 'input',
    rules: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
    attrs: {
      maxlength: 10,
      placeholder: '请输入分组名称',
      showWordLimit: true
    }
  },
  {
    label: '分组图标',
    prop: 'icon',
    type: 'icon',
  },
]

const activeIndex = ref('0')
const selectMenu = (index: string) => {
  activeIndex.value = index
  emit('selectMenu', index)
}

// 打开编辑框
const dialogVisible = ref(false)
const openAddFormDialog = (index?: number) => {
  if (typeof index === 'number') {
    formType = 'edit'
    formData = toRaw(props.list[index])
    formTitle = '编辑分组'
  } else {
    formType = 'add'
    formData = {}
    formTitle = '新增分组'
  }
  dialogVisible.value = true
}

const formSubmit = (formData: object) => {
  if (formType === 'edit') {
    editMenu(formData)
  } else {
    addFormConfirm(formData)
  }
}

// 编辑菜单
const isEdit = ref(false)
const editMenu = (data: any) => {
  const menuList = [...props.list]
  const inx = menuList.findIndex((item) => item.id === data.id)
  if (inx > -1) {
    menuList[inx] = data
    emit('update:list', menuList)
    dialogVisible.value = false
  }
}

// 新增菜单
const addFormConfirm = (data: any) => {
  const menuList = [...props.list]
  const inx = menuList.findIndex((item) => item.name === data.name)
  if (inx >= 0) return ElMessage.error('已存在相同的名称，请重新输入！')

  menuList.push({
    id: generateRandomId(20),
    name: data.name,
    icon: data.icon,
    softwareList: []
  })

  emit('update:list', menuList)
  dialogVisible.value = false
}

// 删除菜单
const deleteMenu = (index: number) => {
  const menuList = [...props.list]
  menuList.splice(index, 1)
  emit('update:list', menuList)
  if (index === Number(activeIndex.value)) {
    nextTick(() => {
      activeIndex.value = '0'
      emit('selectMenu', '0')
    })
  }
}

let menuSortable: any
onMounted(() => {
  setTimeout(() => {
    // 菜单排序
    menuSortable = Sortable.create(elMenuRef.value, {
      // group: 'menu',
      animation: 250,
      ghostClass: "sortable-ghost", //放置占位符的类名
      chosenClass: "sortable-chosen", //所选项目的类名
      forceFallback: true,
      disabled: true,

      onEnd: (evt: any) => {
        const newInx = evt.newDraggableIndex
        const oldInx = evt.oldDraggableIndex
        const menuList = [...props.list]
        const oldItemId = menuList[Number(activeIndex.value)].id

        if (newInx !== oldInx) {
          // 交换位置
          const old = menuList.splice(oldInx, 1)[0]
          menuList.splice(newInx, 0, old)
          // 更新激活项
          const newItemIndex = menuList.findIndex((item) => item.id === oldItemId)
          activeIndex.value = newItemIndex.toString()
          emit('update:list', menuList)
        }
      },
    })
  }, 0);
})

watch(isEdit, () => {
  if (isEdit.value) {
    menuSortable.option('disabled', false)
  } else {
    menuSortable.option('disabled', true)
  }
})
</script>

<style scoped lang="scss">
.menu-content {
  overflow-y: auto;
  flex: 1;
}

.menu-item-name {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
}

.menu-item-tool {
  // position: absolute;
  // right: 10px;

  .el-icon-edit {
    cursor: pointer;
    color: var(--el-color-primary);
  }

  .el-icon-delete {
    cursor: pointer;
    color: var(--el-color-danger) !important;
  }
}

.sortable-ghost {
  border: 2px dashed var(--el-color-primary);
  opacity: 0.5;
}
</style>