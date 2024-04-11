<template>
  <div class="home">
    <div class="home-tabs">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane class="tabs-item" v-for="(item, index) in routeList" :key="item.name" :name="item.path">
          <template #label>
            <span class="tabs-label">
              <el-icon class="tabs-icon">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.name }}</span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="home-container">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const router = useRouter()
const activeName = ref('/software-management')
const routeList = [
  {
    name: '软件管理',
    path: '/software-management',
    icon: 'memo',
  },
  {
    name: '个人中心',
    path: '/',
    icon: 'Avatar',
  },
]

const handleClick = (tab: TabsPaneContext) => {
  console.log(tab.paneName);

  router.push(tab.paneName as string || "/")
}
</script>

<style lang="scss">
.home {
  --tabs-height: 40px;
  height: 100vh;
  overflow: hidden;
}

.home-tabs {
  height: var(--tabs-height);

  .el-tabs__item {
    padding: 5px;
  }

  .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }

  .el-tabs__header {
    margin: 0;
  }

  .tabs-label {
    padding: 0 10px;
    display: flex;
    align-items: center;
  }

  .tabs-icon {
    margin-right: 5px;
  }
}

.home-container {
  height: calc(100% - var(--tabs-height));
}
</style>
