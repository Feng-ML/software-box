<template>
  <div class="basic-menu">
    <div class="card menu-box">
      <div class="top-box"></div>
      <div class="hover-box" ref="HoverBoxRef" :style="{ top: hoverBoxTop }"></div>
      <ul>
        <li
          v-for="(item, index) in list"
          :class="{ active: activeIndex == index }"
          @click="menuClick(index)"
        >
          <i class="iconfont" :class="'icon-' + item.icon"></i>
          <span>{{ item.name }}</span>
          <!-- <span>{{ item.name }}</span> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IMenuItem {
  name: string
  icon: string
  path?: string
}

const emit = defineEmits(['menuClick'])
const props = defineProps({
  list: { type: Array<IMenuItem>, default: () => [] }
})

const HoverBoxRef = ref()
const activeIndex = ref(0)

// 路由初始化选中
const path = useRoute().path
const pathIndex = props.list.findIndex((item) => item.path == path)
if (pathIndex > -1) {
  activeIndex.value = pathIndex
}

const hoverBoxTop = computed(() => {
  return activeIndex.value * 67 + 20 + 'px'
})

function menuClick(index: number) {
  activeIndex.value = index
  HoverBoxRef.value.animate(
    [{ transform: 'scale(1, 1)' }, { transform: 'scale(0.5, 1.5)' }, { transform: 'scale(1, 1)' }],
    {
      duration: 250,
      iterations: '1'
    }
  )

  emit('menuClick', index)
}
</script>

<style lang="scss" scoped>
* {
  text-align: center;
}

.basic-menu {
  padding: 12px;
}

.menu-box {
  position: relative;

  ul {
    padding: 0 15px;
    margin-top: 15px;
    position: relative;

    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 55px;
      height: 55px;
      border-radius: 10px;
      cursor: pointer;
      position: relative;
      z-index: 5;
      margin-bottom: 12px;
      // line-height: 68px;

      span {
        font-size: 10px;
      }

      // span {
      //   display: block;
      //   position: absolute;
      //   left: 80%;
      //   opacity: 0;
      //   top: 12px;
      //   margin-left: 1rem;
      //   color: #fff;
      //   background: var(--el-color-primary);
      //   transition: 250ms ease all;
      //   border-radius: 17.5px;
      //   line-height: 0;
      //   padding: 16px 15px;
      //   white-space: nowrap;
      //   pointer-events: none;
      // }

      // &:hover span {
      //   left: 100%;
      //   opacity: 1;
      // }
    }
  }
}

.top-box {
  width: 71px;
  height: 5px;
  margin: 0 auto;
  background: var(--el-color-primary);
  border-radius: 0 0 12px 12px;
}

.hover-box {
  width: 55px;
  height: 55px;
  margin: 0 auto;
  background: var(--el-color-primary);
  border-radius: 10px;
  position: absolute;
  z-index: 0;
  left: 15px;
  top: 20px;
  transition: 250ms;
}

.active {
  color: white;
}
</style>
