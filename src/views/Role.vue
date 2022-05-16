<template>
  <div class="role-manger">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="p20 white">
      <el-button type="primary" @click="handleAdd">创建</el-button>
    </div>
    <div class="base-table">
      <el-table :data="roleList" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="small">设置权限</el-button>
            <el-button
              @click="handleDel(scope.row._id)"
              size="small"
              type="danger"
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

    <el-dialog v-model="showModal" title="角色新增">
      <el-form
        :model="roleForm"
        label-width="80"
        :rules="rules"
        ref="dialogForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input
            v-model="roleForm.remark"
            placeholder="请输入备注信息"
            type="textarea"
          />
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
import utils from "./../utils/utils";
export default {
  name: "role",
  data() {
    return {
      showModal: false,
      roleList: [],
      roleForm: {
        roleName: "",
        remark: "",
      },
      queryForm: {
        roleName: "",
      },
      pager: {
        total: 0,
        pageSize: 10,
      },
      rules: {
        roleName: [{ required: true, message: "请输入角色名称" }],
      },
      columns: [
        {
          prop: "roleName",
          label: "角色名称",
          width: 180,
        },
        {
          prop: "remark",
          label: "备注",
        },
        {
          prop: "menuType",
          label: "权限列表",
        },
        {
          prop: "createTime",
          label: "创建时间",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    handleQuery() {
      this.getRoleList();
    },
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (val) => {
        if (val) {
          try {
            let { action, roleForm } = this;
            let params = { ...roleForm, action };
            let res = await this.$api.roleSumbit(params);
            this.showModal = false;
            this.$message.success("操作成功");
            this.handleReset("dialogForm");
            this.getRoleList();
          } catch (error) {
            this.$message.fail("操作失败");
          }
        }
      });
    },
    //初始化列表
    async getRoleList() {
      try {
        const res = await this.$api.getRoleList(this.queryForm);
        this.roleList = res.list;
        this.pager = res.page;
      } catch (error) {
        throw new Error(e);
      }
    },
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    //创建角色
    handleAdd() {
      this.showModal = true;
      this.action = "create";
    },
    // 编辑
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.roleForm, row);
      });
    },
    // 删除
    async handleDel(_id) {
      await this.$api.roleSumbit({ _id, action: "delete" });
      this.$message.success("删除成功");
      this.getRoleList();
    },
  },
};
</script>
