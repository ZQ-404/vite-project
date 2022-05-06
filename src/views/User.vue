<template>
  <div class="user-manger">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item prop="userId" label="用户ID">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item prop="userName" label="用户名称">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item prop="state" label="用户状态">
          <el-select placeholder="请选择用户状态" v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger" @click="handlePatch">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button @click="handleClick(scope.row)" size="mini"
              >编辑</el-button
            >
            <el-button @click="handleDel(scope.row)" size="mini" type="danger"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog>
      <el-form>
        <el-form-item></el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
export default {
  name: "User",
  setup() {
    //获取composition API的上下文对象
    const { ctx } = getCurrentInstance();
    const user = reactive({ state: 0 });
    //初始化用户列表数据
    const userList = ref([]);
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
      },
    ]);
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    });
    //被选中用户ID
    const checkedUserIds = ref([]);
    //初始化
    onMounted(() => {
      // getUserList();
    });
    // 发接口查询
    const getUserList = async () => {
      let params = { ...user, ...pager };

      try {
        const { list, page } = await ctx.$api.getUserList(params);
        userList.value = list;
        pager.total = page.total;
      } catch (error) {}
    };
    // 按钮查询
    const handleQuery = () => {
      getUserList();
    };
    // 重置
    const handleReset = () => {
      ctx.$refs.form.resetFields();
    };
    //删除
    const handleDel = async (value) => {
      await ctx.$api.userDel({ userIds: [value.userId] });
      ctx.$message.success("删除成功");
      getUserList();
    };
    //批量删除
    const handlePatch = async () => {
      if (checkedUserIds.value.length === 0) {
        ctx.$message.error("请选择需要删除的用户");
        return;
      }
      const res = await ctx.$api.userDel({ userIds: checkedUserIds.value });
      if (res.nModified > 0) {
        ctx.$message.success("删除成功");
        getUserList();
      } else {
        ctx.$message.error("删除失败");
        getUserList();
      }
    };
    //监听table
    const handleSelectionChange = (list) => {
      checkedUserIds.value = list.map((item) => {
        return item.userId;
      });
    };
    //分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };
    return {
      user,
      userList,
      columns,
      pager,
      checkedUserIds,
      getUserList,
      handleReset,
      handleQuery,
      handleDel,
      handleCurrentChange,
      handlePatch,
      handleSelectionChange,
    };
  },
};
</script>
