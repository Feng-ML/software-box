<template>
  <div class="tool-bar">
    <div>{{ title }}</div>
    <div class="tag-list">
      <el-tag
        class="tag-item"
        v-for="(item, index) in list"
        :key="item.id"
        :disable-transitions="false"
        :type="activeIndex === index ? 'primary' : 'info'"
        :closable="isEdit"
        effect="light"
        @click="activeIndex = index"
        @close="emit('deleteTag', index)"
      >
        {{ item.name }}
      </el-tag>

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
import { nextTick, ref } from 'vue'
import { ElInput } from 'element-plus'

const emit = defineEmits(['add', 'search', 'addTag', 'deleteTag'])
const isEdit = defineModel<boolean>('isEdit')
const activeIndex = defineModel<number>('activeIndex')

defineProps({
  title: String,
  showBtns: {
    type: Boolean,
    default: true
  },
  list: Array<ICategoryItem>
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
</script>

<style lang="scss" scoped>
.tool-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 50px;
  flex-shrink: 0;

  .tag-list {
    display: flex;
    flex: 1;
    overflow: auto;
    margin-right: 12px;
    &::-webkit-scrollbar {
      display: none;
    }
    .tag-item {
      margin-right: 10px;
      cursor: pointer;
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
