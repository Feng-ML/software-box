<template>
    <el-space wrap class="box-content">
        <div v-for="i in cardList" :key="i.name" class="box-card" shadow="hover">
            <el-tooltip class="box-item" effect="dark" :content="i.name" placement="top">
                <el-image style="width: 100px; height: 100px" :src="i.icon" />
                <!-- <div class="box-name">名称</div> -->
            </el-tooltip>
        </div>
        <div class="box-card" @click="addItem">
            <el-button type="primary" circle>
                <el-icon>
                    <Plus />
                </el-icon>
            </el-button>
        </div>
    </el-space>
</template>

<script lang='ts' setup>
import defaultImg from '@/assets/images/Bartender.png';
import { reactive, ref } from 'vue';

const cardList = reactive([
    {
        name: 'Bartender4',
        icon: defaultImg
    }, {
        name: 'Bartender2',
        icon: defaultImg
    }, {
        name: 'Bartender3',
        icon: defaultImg
    }, {
        name: 'Bartender4',
        icon: defaultImg
    }, {
        name: 'Bartender2',
        icon: defaultImg
    }, {
        name: 'Bartender3',
        icon: defaultImg
    }, {
        name: 'Bartender4',
        icon: defaultImg
    }
])

const addItem = async () => {
    window.ipcRenderer.invoke('dialog:openFile').then(file => {
        console.log(file);
        if (file) cardList.push(...file)
    })
}

</script>

<style lang="scss" scoped>
.box-content {
    padding: 12px;
}

.box-card {
    cursor: pointer;
    transition-duration: 0.3s;
    padding: 10px;
    min-width: 100px;
    min-height: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &:hover {
        transform: scale(1.2);
    }

    .box-item {
        width: 110px;
        margin-top: 40px;
    }

    .box-name {
        text-align: center;
        line-height: 30px;
    }
}
</style>