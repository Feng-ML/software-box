<template>
  <el-menu :default-active="activeIndex" ref="elMenuRef" class="el-menu" :collapse="isCollapse" @select="selectMenu">
    <div class="menu-title">
      <div>分类</div>

      <div v-if="!isEdit" class="menu-tool">
        <el-icon @click="isEdit = !isEdit" title="设置">
          <Tools />
        </el-icon>
        <!-- <el-icon @click="isCollapse = !isCollapse">
          <Operation />
        </el-icon> -->
      </div>
      <div v-else class="menu-tool">
        <el-icon class="main-color" @click="openAddFormDialog()" title="添加">
          <CirclePlusFilled />
        </el-icon>
        <el-icon class="success-color" @click="isEdit = !isEdit" title="完成"><Select /></el-icon>
      </div>
    </div>


    <el-menu-item v-for="(item, index) in list" :key="item.id" :index="index + ''">
      <el-icon>
        <component :is="item.icon" />
      </el-icon>
      <!-- <template #title>{{ item.name }}</template> -->
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
  </el-menu>

  <BasicDialog :title="formTitle" v-model="dialogVisible" :form-type="formType" :form-data="formData" width="400"
    :form-config="formConfig" @submit="formSubmit" />
</template>

<script lang="ts" setup>
import { onMounted, ref, toRaw } from 'vue'
import { ElMessage } from 'element-plus'
import Sortable from 'sortablejs';

import BasicDialog from './BasicDialog.vue'
import type { IFormConfigItem } from './BasicDialog.vue';
import type { ICategoryItem } from "@/interfaces";
import { generateRandomId } from '@/utils/common'

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
    label: '分类名称',
    prop: 'name',
    type: 'input',
    rules: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    attrs: {
      maxlength: 10,
      placeholder: '请输入分类名称',
      showWordLimit: true
    }
  },
  {
    label: '分类图标',
    prop: 'icon',
    type: 'icon',
  },
]

const selectMenu = (index: string) => {
  emit('selectMenu', index)
}

// 打开编辑框
const dialogVisible = ref(false)
const openAddFormDialog = (index?: number) => {
  if (typeof index === 'number') {
    formType = 'edit'
    formData = toRaw(props.list[index])
    formTitle = '编辑分类'
  } else {
    formType = 'add'
    formData = {}
    formTitle = '新增分类'
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
}

const activeIndex = ref('0')
onMounted(() => {
  setTimeout(() => {
    Sortable.create(elMenuRef.value.$el, {
      // group: 'menu',
      animation: 250,
      ghostClass: "sortable-ghost", //放置占位符的类名
      chosenClass: "sortable-chosen", //所选项目的类名
      forceFallback: true,

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
</script>

<style scoped lang="scss">
.menu-title {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}

.menu-tool {
  text-align: right;
  display: flex;
  align-items: center;

  .el-icon {
    margin-left: 10px;
    cursor: pointer;
  }
}

.el-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
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