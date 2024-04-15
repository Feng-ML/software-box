<template>
    <main>
        <div id="menu">
            <BoxMenu :list="categoryList" @update:list="updateList" @selectMenu="selectMenu" />
        </div>

        <div id="content">
            <BoxContent :list="softwareList" :has-menu="!!categoryList.length" @update:list="updateSoftwareList" />
        </div>
    </main>
</template>

<script lang="ts" setup>
import BoxMenu from "./boxMenu.vue"
import BoxContent from "./boxContent.vue"
import { nextTick, ref, shallowRef, provide } from "vue";
import type { ICategoryItem, ISoftware } from "@/interfaces";
import { useRoute } from 'vue-router';

const route = useRoute()
// 是否为桌面组件
const isDesktop = route.fullPath.includes('desktop')
provide('isDesktop', isDesktop)

let activeIndex = 0
const categoryList = shallowRef<ICategoryItem[]>([]);
window.ipcRenderer.invoke("get-category-list").then((data: ICategoryItem[]) => {
    if (data && data.length) {
        categoryList.value = data
        softwareList.value = categoryList.value[activeIndex].softwareList
    }
})

// 刷新软件悬浮框
window.ipcRenderer.on("category-list-change", (event, data: ICategoryItem[]) => {
    if (isDesktop) location.reload()
})

const updateList = (list: ICategoryItem[]) => {
    categoryList.value = []

    nextTick(() => {
        categoryList.value = list
        window.ipcRenderer.send("set-category-list", list)
    })
}

// 软件列表
const softwareList = shallowRef<ISoftware[]>([])
const selectMenu = (index: string) => {
    activeIndex = Number(index)
    softwareList.value = categoryList.value[activeIndex]?.softwareList
}

const updateSoftwareList = (list: ISoftware[]) => {
    softwareList.value = list
    categoryList.value[activeIndex].softwareList = list
    updateList(categoryList.value)
}

</script>

<style scoped lang="scss">
main {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

#content {
    flex: 1;
}
</style>