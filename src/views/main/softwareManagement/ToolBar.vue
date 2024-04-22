<template>
  <div class="tool-bar">
    <div>{{ title }}</div>
    <div class="tag-list">
      <div v-for="(item, index) in list" class="tag-item" :key="item.id">
        <el-input
          v-if="editIndex === index"
          :id="'tagInput' + index"
          v-model="editInputValue"
          size="small"
          @keyup.enter="handleEditConfirm"
          @blur="handleEditConfirm"
        />

        <el-tag
          v-else
          :type="activeIndex === index ? 'primary' : 'info'"
          :closable="isEdit"
          effect="light"
          size="large"
          @click="activeIndex = index"
          @close="emit('deleteTag', index)"
          @contextmenu="handleContextmenu(index)"
        >
          {{ item.name }}
        </el-tag>
      </div>

      <div v-if="!isDesktop">
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else text size="small" icon="plus" circle @click="showInput" />
      </div>
    </div>

    <BasicSearch @change="emit('search', $event)" />

    <div v-if="showBtns">
      <div v-if="!isEdit" class="btns">
        <el-icon title="设置" size="20" @click="isEdit = !isEdit">
          <Tools />
        </el-icon>
      </div>
      <div v-else class="btns">
        <el-icon class="main-color" size="20" @click="emit('add')" title="添加">
          <CirclePlusFilled />
        </el-icon>
        <el-icon class="success-color" size="20" title="完成" @click="isEdit = !isEdit">
          <Select />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BasicSearch from '@/components/BasicSearch.vue'
import type { ICategoryItem } from '@/interfaces'
import { inject, nextTick, ref } from 'vue'
import { ElInput } from 'element-plus'

const isDesktop = inject('isDesktop')
const emit = defineEmits(['add', 'search', 'addTag', 'deleteTag', 'editTag'])
const isEdit = defineModel<boolean>('isEdit')
const activeIndex = defineModel<number>('activeIndex')

const props = defineProps({
  title: String,
  showBtns: {
    type: Boolean,
    default: true
  },
  list: {
    type: Array<ICategoryItem>,
    default: () => []
  }
})

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    emit('addTag', inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 编辑
const editInputValue = ref('')
const editIndex = ref(-1)
const handleEditConfirm = () => {
  if (editInputValue.value) {
    emit('editTag', selectIndex, editInputValue.value)
  }
  editIndex.value = -1
  editInputValue.value = ''
}

// 右键菜单
let selectIndex: number
const handleContextmenu = (index: number) => {
  if (isDesktop) return

  selectIndex = index
  const menuList = [
    { label: '重命名', value: 'tag-rename' },
    { label: '删除', value: 'tag-delete' }
  ]
  window.ipcRenderer.send('show-context-menu', menuList)
}

window.ipcRenderer.on('context-menu-command', (event: any, command: string) => {
  switch (command) {
    case 'tag-rename':
      editIndex.value = selectIndex
      editInputValue.value = props.list[selectIndex]?.name
      nextTick(() => {
        const el = document.getElementById('tagInput' + selectIndex)
        el?.focus()
      })
      break
    case 'tag-delete':
      emit('deleteTag', selectIndex)
      break
    default:
      break
  }
})
</script>

<style lang="scss" scoped>
.tool-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  height: 50px;
  flex-shrink: 0;

  .tag-list {
    display: flex;
    flex: 1;
    overflow: auto;
    margin-right: 12px;
    align-items: center;
    &::-webkit-scrollbar {
      display: none;
    }
    .tag-item {
      margin-right: 10px;
      cursor: pointer;
      .el-input {
        width: 120px;
      }
    }
  }

  .basic-search {
    margin-left: auto;
    flex-shrink: 0;
  }

  .btns {
    text-align: right;
    display: flex;
    align-items: center;

    .el-icon {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
