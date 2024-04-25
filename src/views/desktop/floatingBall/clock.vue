<template>
  <div class="clock-wrapper">
    <div class="clock-base">
      <div class="clock-dial">
        <div v-for="i in 12" class="clock-indicator"></div>
      </div>
      <div id="clock-hour"></div>
      <div id="clock-minute"></div>
      <div id="clock-second"></div>
      <div class="clock-center"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'

// 获取当前时间指针角度
const now = new Date(),
  hourDeg = (now.getHours() / 12) * 360 + (now.getMinutes() / 60) * 30,
  minuteDeg = (now.getMinutes() / 60) * 360 + (now.getSeconds() / 60) * 6,
  secondDeg = (now.getSeconds() / 60) * 360

// 设置指针转动动画
function setAnimation(domId: string, deg: number, duration: number) {
  const dom = document.getElementById(domId)
  if (dom) {
    dom.animate([{ transform: `rotate(${deg}deg)` }, { transform: `rotate(${deg + 360}deg)` }], {
      duration,
      iterations: Infinity,
      easing: 'linear'
    })
  }
}

onMounted(() => {
  setAnimation('clock-hour', hourDeg, 43200000)
  setAnimation('clock-minute', minuteDeg, 3600000)
  setAnimation('clock-second', secondDeg, 60000)
})
</script>

<style lang="scss" scoped>
@mixin center {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}

.clock-wrapper {
  @include center;
  transform: scale(0.165);
  transform-origin: 4px 50%;
  width: 250px;
  height: 250px;
  padding: 5px;
  background-image: linear-gradient(#f7f7f7, #e0e0e0);
  background: #555;
  border-radius: 50%;
  box-shadow:
    0 10px 15px rgba(0, 0, 0, 0.15),
    0 2px 2px rgba(0, 0, 0, 0.2);
}
.clock-base {
  width: 250px;
  height: 250px;
  background-color: #eee;
  border-radius: 50%;
  box-shadow: 0 0 5px #eee;
}
.clock-dial {
  @include center;
  z-index: 1;
  width: 230px;
  height: 230px;
  .clock-indicator {
    position: absolute;
    width: 2px;
    height: 4px;
    margin: 113px 114px;
    background-color: #ddd;
  }
}

// 刻度
@for $i from 1 through 12 {
  .clock-indicator:nth-child(#{$i}) {
    transform: rotate(#{30 * $i}deg) translateY(-113px);
    background-color: #aaa;
    @if $i%3==0 {
      background-color: #c00;
    }
  }
}

#clock-hour {
  position: absolute;
  z-index: 2;
  top: 80px;
  left: 128px;
  width: 10px;
  height: 65px;
  background-color: #555;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  transform-origin: 2px 50px;
  transition: 0.5s;
}
#clock-minute {
  position: absolute;
  z-index: 3;
  top: 60px;
  left: 128px;
  width: 10px;
  height: 85px;
  background-color: #555;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  transform-origin: 2px 70px;
  transition: 0.5s;
}
#clock-second {
  position: absolute;
  z-index: 4;
  top: 20px;
  left: 129px;
  width: 8px;
  height: 130px;
  background-color: #a00;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  transform-origin: 1px 110px;
  transition: 0.5s;
}
#clock-second:after {
  content: '';
  display: block;
  position: absolute;
  left: -5px;
  bottom: 14px;
  width: 8px;
  height: 8px;
  background-color: #a00;
  border: solid 2px #a00;
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}
.clock-center {
  @include center;
  z-index: 1;
  width: 150px;
  height: 150px;
  background-image: linear-gradient(#e3e3e3, #f7f7f7);
  border-radius: 50%;
  box-shadow:
    inset 0 -1px 0 #fafafa,
    inset 0 1px 0 #e3e3e3;
}
.clock-center:after {
  content: '';
  display: block;
  width: 20px;
  height: 20px;
  @include center;
  background-color: #ddd;
  border-radius: 50%;
}
</style>
