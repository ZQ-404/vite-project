<template>
  <template v-for="(menu, index) in userMenu">
    <el-sub-menu
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == '1'
      "
      :key="menu._id"
      :index="menu.path"
    >
      <template #title>
        <el-icon><setting /></el-icon>
        <span>{{ menu.menuName }}</span>
      </template>
      <tree-menu :userMenu="menu.children" />
    </el-sub-menu>
    <el-menu-item
      v-else-if="menu.menuType == '1'"
      :index="menu.path"
      :key="index"
      >{{ menu.menuName }}</el-menu-item
    >
  </template>
</template>
<script>
import { Setting } from "@element-plus/icons-vue";
export default {
  name: "TreeMenu",
  components: {
    Setting,
  },
  props: {
    userMenu: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>
