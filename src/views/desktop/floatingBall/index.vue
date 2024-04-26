<template>
  <div id="ballWin" @click="ballClick" @mousedown="mousedown" :style="{ opacity }">
    <div class="ballBox" draggable="false" :class="setting.ballContent">
      <div class="background-circle"></div>
      <div class="up-circle"></div>
      <p v-if="setting.ballContent === 'time'" class="time-number">{{ time }}</p>
      <Clock v-else-if="setting.ballContent === 'clock'" />
      <img v-else draggable="false" src="@/../public/favicon.ico" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import settingStore from '@/stores/setting'
import Clock from './clock.vue'

const setting = settingStore().setting
const opacity = computed(() => setting.ballTransparency / 100)

// 是否可拖拽
// const draggable = ref(true);

// const aside = ref<string>('')
// window.ipcRenderer.on('adsorb-aside', (e, value) => {
//     aside.value = value;
// })

const time = ref('')
var timerID = setInterval(updateTime, 1000)
updateTime()
function updateTime() {
  var cd = new Date()
  time.value = zeroPadding(cd.getHours()) + ':' + zeroPadding(cd.getMinutes())
}
function zeroPadding(num: number) {
  return num < 10 ? '0' + num : num
}

// 悬浮球移动
let isMouseDown = false
let ismoving = false
const mousedown = (e: any) => {
  isMouseDown = true
  let dinatesX = e.x
  let dinatesY = e.y

  document.onmousemove = function (ev) {
    if (isMouseDown) {
      ismoving = true
      const x = ev.screenX - dinatesX
      const y = ev.screenY - dinatesY
      // 给主进程传入坐标
      window.ipcRenderer.send('ball-move', { x, y })
    }
  }
  document.onmouseup = (ev) => {
    setTimeout(() => {
      ismoving = false
      isMouseDown = false
    }, 10)
    window.ipcRenderer.send('ball-moved')
  }
}
// 悬浮球点击
const ballClick = () => {
  if (!ismoving) {
    window.ipcRenderer.send('ball-click')
  }
}

// const onmousemove = () => {
//     if (!ismoving) {
//         window.ipcRenderer.send('ball-click')
//     }
// }
// const onmouseleave = () => {
//     if (!ismoving) {
//         window.ipcRenderer.send('ball-leave')
//     }
// }

onUnmounted(() => {
  clearInterval(timerID)
})
</script>

<style lang="scss" scoped>
#ballWin {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ballBox {
  position: relative;
  margin: auto;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: center;

  .background-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(#42abff, #ff4f8b, #ffeb3b);
    animation: rotate 2s linear infinite;
  }

  .up-circle {
    background: #fff1eb;
    display: block;
    position: absolute;
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    margin: 4px;
    border-radius: 50%;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    opacity: 0.7;
  }
  &.time .up-circle {
    background: radial-gradient(ellipse at center, #0a2e38 0%, #000000 70%);
    opacity: 1;
  }
  &.clock .up-circle {
    background: none;
    opacity: 1;
  }

  img {
    width: 65%;
    display: block;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .time-number {
    position: absolute;
    font-size: 12px;
    text-align: center;
    width: 100%;
    user-select: none;
    font-weight: bold;
    font-family: 'Share Tech Mono', monospace;
    color: #daf6ff;
    text-shadow:
      0 0 20px rgba(10, 175, 230, 1),
      0 0 20px rgba(10, 175, 230, 0);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// .left:hover {
//     transform: translateX(-50px);
// }

// .right:hover {
//     transform: translateX(-30px);
// }

/* 可拖拽 */
.draggable {
  -webkit-app-region: drag;
}
</style>
