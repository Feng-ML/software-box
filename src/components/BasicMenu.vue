<template>
  <el-menu default-active="0" ref="elMenuRef" class="el-menu-vertical" :collapse="isCollapse">
    <div class="menu-title">
      <div>菜单</div>

      <div v-if="!isEdit" class="menu-tool">
        <el-icon @click="isEdit = !isEdit">
          <Tools />
        </el-icon>
        <!-- <el-icon @click="isCollapse = !isCollapse">
          <Operation />
        </el-icon> -->
      </div>
      <div v-else class="menu-tool">
        <el-icon class="main-color" @click="openAddFormDialog">
          <CirclePlusFilled />
        </el-icon>
        <el-icon class="success-color" @click="isEdit = !isEdit"><Select /></el-icon>
      </div>
    </div>


    <el-menu-item v-for="(item, index) in menuList" :key="item.name" :index="index + ''">
      <el-icon>
        <component :is="item.icon" />
      </el-icon>
      <template #title>{{ item.name }}</template>

      <el-popconfirm title="确定删除吗?" @confirm.stop="deleteMenu(item)">
        <template #reference>
          <el-icon class="el-icon-delete" v-show="isEdit">
            <RemoveFilled />
          </el-icon>
        </template>
      </el-popconfirm>
    </el-menu-item>
  </el-menu>

  <BasicDialog v-model="dialogVisible" :form-config="formConfig" @submit="addFormConfirm"></BasicDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

import BasicDialog from './BasicDialog.vue'
import type { IFormConfigItem } from './BasicDialog.vue';

const isCollapse = ref(false)
const elMenuRef = ref()

interface IMenuItem {
  name: string,
  icon: string,
}
const menuList: IMenuItem[] = reactive([{
  name: 'Navigator One',
  icon: 'Document',
}, {
  name: 'Navigator Two',
  icon: 'Menu',
}])

let formConfig: IFormConfigItem[] = [
  {
    label: '菜单名称',
    prop: 'name',
    type: 'input',
    rules: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
  },
  {
    label: '菜单图标',
    prop: 'icon',
    type: 'icon',
  },
]

// 编辑菜单
const isEdit = ref(false)

// 新增菜单
const dialogVisible = ref(false)
const openAddFormDialog = () => {
  dialogVisible.value = true
}
const addFormConfirm = (data: any) => {
  const inx = menuList.findIndex((item) => item.name === data.name)
  if (inx >= 0) return ElMessage.error('已存在相同的名称，请重新输入！')

  menuList.push({
    name: data.name,
    icon: data.icon,
  })

  dialogVisible.value = false
}

// 删除菜单
const deleteMenu = (item: IMenuItem) => {
  const inx = menuList.findIndex((i) => i.name === item.name)
  if (inx > -1) {
    menuList.splice(inx, 1)
  }
}

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

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-icon-delete {
  cursor: pointer;
  color: var(--el-color-danger) !important;
  position: absolute;
  right: 10px;
}
</style>