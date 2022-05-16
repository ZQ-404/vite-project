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
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
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
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" size="small"
              >编辑</el-button
            >
            <el-button @click="handleDel(scope.row)" size="small" type="danger"
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
    <el-dialog v-model="showModal" title="用户新增">
      <el-form
        :model="userForm"
        label-width="80"
        :rules="rules"
        ref="dialogForm"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            placeholder="请输入用户名"
            :disabled="action === 'edit'"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            placeholder="请输入用户邮箱"
            :disabled="action === 'edit'"
          >
            <template #append>@qq.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入用户手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入用户岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职" />
            <el-option :value="2" label="离职" />
            <el-option :value="3" label="试用期" />
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="item in roleList"
              :key="item._id"
              :label="item.roleName"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
import utils from "./../utils/utils";
export default {
  name: "User",
  setup() {
    //获取composition API的上下文对象
    const { proxy } = getCurrentInstance();
    const user = reactive({ state: 0 });
    const showModal = ref(false);
    //初始化用户列表数据
    const userList = ref([]);
    //用户操作类型
    const action = ref("add");
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
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value));
        },
      },
    ]);
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    });
    const userForm = reactive({
      state: 3,
    });
    //被选中用户ID
    const checkedUserIds = ref([]);
    //所有角色列表
    const roleList = ref([]);
    //部门
    const deptList = ref([]);
    //表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "change",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "change",
        },
      ],
      mobile: [
        {
          pattern: /1\d{10}/,
          message: "手机号格式不正确",
          trigger: "change",
        },
      ],
    });
    //初始化
    onMounted(() => {
      getUserList();
    });
    // 用户新增
    const handleCreate = () => {
      action.value = "add";
      getDeptList();
      getRoleAllList();
      showModal.value = true;
    };
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(userForm); //对邮箱值做拼接，不影响视图
          params.userEmail += "@qq.com";
          params.action = action.value;
          let res = await proxy.$api.userSumbit(params);
          if (res) {
            showModal.value = false;
            action.value === "add" && proxy.$message.success("用户创建成功!");
            action.value === "edit" && proxy.$message.success("用户编辑成功!");
            handleReset("dialogForm");
            getUserList();
          }
        }
      });
    };
    // 发接口查询
    const getUserList = async () => {
      let params = { ...user, ...pager };

      try {
        const { list, page } = await proxy.$api.getUserList(params);
        userList.value = list;
        pager.total = page.total;
      } catch (error) {}
    };
    // 按钮查询
    const handleQuery = () => {
      getUserList();
    };
    // 重置
    const handleReset = (formId) => {
      proxy.$refs[formId].resetFields();
    };
    //删除
    const handleDel = async (value) => {
      await proxy.$api.userDel({ userIds: [value.userId] });
      proxy.$message.success("删除成功");
      getUserList();
    };
    //批量删除
    const handlePatch = async () => {
      if (checkedUserIds.value.length === 0) {
        proxy.$message.error("请选择需要删除的用户");
        return;
      }
      const res = await proxy.$api.userDel({ userIds: checkedUserIds.value });
      if (res.nModified > 0) {
        proxy.$message.success("删除成功");
        getUserList();
        return;
      }
      proxy.$message.error("删除失败");

      getUserList();
    };
    //监听table
    const handleSelectionChange = (list) => {
      checkedUserIds.value = list.map((item) => {
        return item.userId;
      });
    };
    //获取用户角色
    const getRoleAllList = async () => {
      roleList.value = await proxy.$api.getRoleAllList();
    };
    //获取部门列表
    const getDeptList = async () => {
      deptList.value = await proxy.$api.getDeptList();
    };
    //分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };
    //编辑
    const handleEdit = (row) => {
      action.value = "edit";
      getDeptList();
      getRoleAllList();
      showModal.value = true;
      proxy.$nextTick(() => {
        Object.assign(userForm, row);
      });
    };
    return {
      deptList,
      user,
      userList,
      roleList,
      columns,
      pager,
      userForm,
      checkedUserIds,
      rules,
      action,
      showModal,
      getUserList,
      handleCreate,
      handleReset,
      handleQuery,
      handleDel,
      handleCurrentChange,
      handlePatch,
      handleSelectionChange,
      getRoleAllList,
      getDeptList,
      handleClose,
      handleSubmit,
      handleEdit,
    };
  },
};
</script>
