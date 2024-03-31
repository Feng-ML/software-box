<template>
  <main>
    <div id="menu">
      <BasicMenu :list="categoryList" @update:list="updateList" @selectMenu="selectMenu" />
    </div>

    <div id="content">
      <BoxContent :list="softwareList" @update:list="updateSoftwareList" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import BasicMenu from "@/components/BasicMenu.vue"
import BoxContent from "./boxContent.vue"
import { ref, shallowRef, watchEffect } from "vue";
import type { ICategoryItem, ISoftware } from "@/interfaces";

const categoryList = shallowRef<ICategoryItem[]>([]);
window.ipcRenderer.invoke("get-category-list").then((data: ICategoryItem[]) => {
  categoryList.value = data
  softwareList.value = categoryList.value[activeIndex].softwareList
})

const updateList = (list: ICategoryItem[]) => {
  console.log(list);

  categoryList.value = list
  window.ipcRenderer.send("set-category-list", list)
}

// 软件列表
let activeIndex = 0
const softwareList = shallowRef<ISoftware[]>([])
const selectMenu = (index: string) => {
  activeIndex = Number(index)
  softwareList.value = categoryList.value[Number(index)].softwareList
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
}

#content {
  flex: 1;
  // background-color: aquamarine;
}
</style>