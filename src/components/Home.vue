<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统logo -->
      <div class="logo">
        <img src="../assets/images/logo.png" alt="" />
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        class="nav-menu"
        background-color="#001529"
        text-color="#fff"
        router
        :collapse="isCollapse"
      >
        <tree-menu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nva-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon v-if="isCollapse"><expand /></el-icon>
            <el-icon v-else><fold /></el-icon>
          </div>
          <div class="bread"><bread-crumb /></div>
        </div>
        <div class="user-info">
          <el-badge
            :is-dot="noticeCount > 0 ? true : false"
            class="notice"
            type="danger"
          >
            <el-icon><bell /></el-icon>
          </el-badge>
          <el-dropdown class="notice-list" @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱：{{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <div class="mian-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Setting, Expand, Fold, Bell } from "@element-plus/icons-vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import TreeMenu from "@/components/TreeMenu.vue";
export default {
  name: "Home",
  components: {
    Setting,
    Expand,
    Bell,
    Fold,
    TreeMenu,
    BreadCrumb,
  },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1), //激活的菜单index
    };
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
  },
  methods: {
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    handleLogout(key) {
      if (key === "email") return;
      this.$store.commit("saveUserInfo", "");
      this.userInfo = null;
      this.$router.push("./login");
    },
    async getNoticeCount() {
      try {
        this.noticeCount = await this.$api.noticeCount({});
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async getMenuList() {
      try {
        this.userMenu = await this.$api.getMenuList();
      } catch (error) {
        this.$message.error(error.message);
      }
    },
  },
};
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    width: 200px;
    transition: width 0.5s;
    //合并
    &.fold {
      width: 80px;
    }
    //展开
    &.unfold {
      width: 200px;
    }
    position: fixed;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        width: 32px;
        height: 32px;
        margin: 0px 16px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
  }

  .content-right {
    margin-left: 200px;
    //合并
    &.fold {
      margin-left: 80px;
    }
    //展开
    &.unfold {
      margin-left: 200px;
    }
    .nva-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
    }
    .nav-left {
      display: flex;
      align-items: center;
      .menu-fold {
        margin-right: 15px;
        font-size: 18px;
        margin-top: 4px;
      }
    }
    .user-info {
      .notice {
        line-height: 30px;
        margin-right: 8px;
      }
      .notice-list {
        vertical-align: text-top;
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .mian-page {
        background-color: #fff;
        height: 100%;
      }
    }
  }
}
</style>
