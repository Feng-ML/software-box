<template>
    <div id="ballWin" @mousedown="mousedown">
        <div class="ballBox" :class="aside" @click="ballClick">
            <img draggable="false" src="@/assets/images/Bartender.png" alt="">
        </div>
    </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';

// 是否可拖拽
// const draggable = ref(true);

const aside = ref<string>('');
// window.ipcRenderer.on('adsorb-aside', (e, value) => {
//     aside.value = value;
// })

const ballClick = () => {
    // alert('asdasd');
}

let ismoving = false;
const mousedown = (e: any) => {
    ismoving = true
    let dinatesX = e.x
    let dinatesY = e.y

    document.onmousemove = (ev) => {
        if (ismoving) {
            const x = ev.screenX - dinatesX
            const y = ev.screenY - dinatesY
            // 给主进程传入坐标
            window.ipcRenderer.send('ball-move', { x, y })
        }
    };
    document.onmouseup = (ev) => {
        ismoving = false
        window.ipcRenderer.send('ball-moved')
    };
}
</script>

<style lang="scss" scoped>
#ballWin {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.ballBox {
    margin: auto;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    font-size: 14px;

    img {
        width: 100%;
    }
}

.left:hover {
    transform: translateX(-50px);
}

.right:hover {
    transform: translateX(-30px);
}

/* 可拖拽 */
.draggable {
    -webkit-app-region: drag;
}
</style>