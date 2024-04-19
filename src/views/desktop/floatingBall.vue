<template>
    <div id="ballWin" @click="ballClick" @mousedown="mousedown">
        <div class="ballBox" draggable="false" :class="aside">
            <div class="background-circle"></div>
            <div class="up-circle"></div>
            <img draggable="false" src="@/../public/favicon.ico" alt="">
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

let isMouseDown = false;
let ismoving = false;
const mousedown = (e: any) => {
    isMouseDown = true;
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
    };
    document.onmouseup = (ev) => {
        setTimeout(() => {
            ismoving = false
            isMouseDown = false
        }, 10)
        window.ipcRenderer.send('ball-moved')
    };
}

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
</script>

<style lang="scss" scoped>
#ballWin {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.ballBox {
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

    .background-circle {
        // position: absolute;
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

    img {
        width: 65%;
        display: block;
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0
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