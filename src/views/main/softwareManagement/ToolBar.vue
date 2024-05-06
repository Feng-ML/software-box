<template>
  <div class="tool-bar">
    <div class="tool-bar-left">
      <div>{{ title }}</div>

      <Draggable
        v-model="tagList"
        item-key="id"
        class="tag-list"
        :animation="200"
        :disabled="sortDisable"
        @end="handleSort"
      >
        <template #item="{ element, index }">
          <div class="tag-item">
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
              {{ element.name }}
            </el-tag>
          </div>
        </template>
      </Draggable>

      <div v-if="!isDesktop">
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else text size="small" :icon="Plus" circle @click="showInput" />
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
          <SelectIcon />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, nextTick, ref, toRaw, computed, watch, shallowRef } from 'vue'
import type { ICategoryItem } from '@/interfaces'
import { ElInput } from 'element-plus'

import BasicSearch from '@/components/BasicSearch.vue'
import Draggable from 'vuedraggable'
import { Tools, CirclePlusFilled, Select as SelectIcon, Plus } from '@element-plus/icons-vue'

const isDesktop = inject('isDesktop')
const emit = defineEmits(['add', 'search', 'addTag', 'deleteTag', 'editTag', 'sortTag'])
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
const tagList = ref<ICategoryItem[]>([])
watch(
  () => props.list,
  (val) => (tagList.value = toRaw(val))
)

// 新增
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

// 排序
const sortDisable = computed(() => inputVisible.value || editInputValue.value)
const handleSort = () => {
  emit(
    'sortTag',
    toRaw(tagList.value).map((item) => toRaw(item))
  )
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
      editInputValue.value = props.list[selectIndex].name
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
  padding: 10px 20px 0;
  height: 50px;
  flex-shrink: 0;

  .tool-bar-left {
    display: flex;
    align-items: center;
    flex: 1;
    overflow: auto;
    margin-right: 12px;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .tag-list {
    display: flex;
    align-items: center;
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
