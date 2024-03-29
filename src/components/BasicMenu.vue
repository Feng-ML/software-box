<template>
  <el-button style="margin-bottom: 20px" @click="isCollapse = !isCollapse">toggle</el-button>
  <el-button type="primary" style="margin-bottom: 20px" @click="openAddFormDialog">新增</el-button>

  <el-menu default-active="0" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
    @close="handleClose">
    <el-menu-item v-for="(item, index) in menuList" :key="item.name" :index="index + ''">
      <el-icon>
        <component :is="item.icon" />
      </el-icon>
      <template #title>{{ item.name }}</template>
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
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const menuList = reactive([{
  name: 'Navigator One',
  icon: 'Document',
}, {
  name: 'Navigator Two',
  icon: 'Menu',
}])

//新增菜单
const dialogVisible = ref(false)
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
const openAddFormDialog = () => {
  dialogVisible.value = true
}

const addFormConfirm = (data: any) => {
  console.log(data);

  const inx = menuList.findIndex((item: any) => item.name === data.name)
  if (inx >= 0) return ElMessage.error('已存在相同的名称，请重新输入！')

  menuList.push({
    name: data.name,
    icon: data.icon,
  })

  dialogVisible.value = false
}

</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>