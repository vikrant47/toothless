<template>
  <template v-if="!item.hidden">
    <template v-if="showSidebarItem(item.children, item)">
      <Link v-if="item.meta" :to="item.path">
        <el-menu-item :index="item.path" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item :meta="item.meta || item.meta" />
          <template #title>{{ item.meta?.title }}</template>
        </el-menu-item>
      </Link>
    </template>
    <el-sub-menu v-else ref="subMenu" :index="item.path" popper-append-to-body>
      <template v-if="item.meta" #title>
        <item :meta="item.meta" />
        <span>{{ item.meta.title }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="child.path"
      />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
/*初始化参数比如引入组件，proxy,state等*/
import Link from './Link.vue'
import Item from './Item'
import { isExternal } from '@/utils/validate'
import path from 'path'
import { RouteItemTy } from '~/router'
const props = defineProps({
  //每一个router Item
  item: {
    type: Object,
    required: true
  },
  //用于判断是不是子Item,设置响应的样式
  isNest: {
    type: Boolean,
    default: false
  },
  //基础路径，用于拼接
  basePath: {
    type: String,
    default: ''
  }
})
onMounted(() => {
  // console.log("我挂载了");
  // console.log(proxy.item);
})
//显示sidebarItem 的情况
let onlyOneChild: any = ref(null)
const showSidebarItem = (children = [], parent: RouteItemTy) => {
  const showingChildren = children.filter((item: RouteItemTy) => {
    if (item.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })
  if (showingChildren.length === 1 && !parent?.alwaysShow) {
    return true
  }
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noChildren: true }
    return true
  }
  return false
}
const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return path;// .resolve(props.basePath, routePath)
}
</script>

<style lang="scss">
// menu hover
/* .submenu-title-noDropdown,
  .el-submenu__title {
    &:hover {
      background-color: $menuHover !important;
    }
  }

  .is-active>.el-submenu__title {
    color: $subMenuActiveText !important;
  }*/
</style>
