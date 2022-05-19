<template>
  <div class="dept-mange">
    <div class="query-form">
      <el-form :inline="true" ref="queryForm" :model="queryForm">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            v-model="queryForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQueryList">查询</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="base-table">
        <div class="action">
          <el-button type="primary" @click="handleCreateOpen">创建</el-button>
        </div>
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              type="primary"
              size="small"
              >编辑</el-button
            >
            <el-button
              @click="handleDel(scope.row._id)"
              type="danger"
              size="small"
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
      <el-dialog v-model="showCreateWin" :title="dialogTitle">
        <el-form
          :model="deptForm"
          ref="dialogForm"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="上级部门" prop="parentId">
            <el-cascader
              placeholder="请选择上级部门"
              v-model="deptForm.parentId"
              :options="deptList"
              :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
              clearable
              :show-all-levels="true"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="部门名称" prop="deptName">
            <el-input
              placeholder="请输入部门名称"
              v-model="deptForm.deptName"
            ></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="user">
            <el-select placeholder="请选择部门负责人" v-model="deptForm.user">
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :value="`${item.userId}/${item.userName}/${item.userEmail}`"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人邮箱" prop="userEmail">
            <el-input disabled :value="deptForm.userEmail"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleCancle">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import utils from "../utils/utils.js";
import table from "../utils/table.js";
export default {
  name: "dept",
  mixins: [table],
  data() {
    return {
      userList: [{ userId: "", uerName: "", userEmail: "" }],
      action: "",
      dialogTitle: "",
      showCreateWin: false,
      queryForm: { deptName: "" },
      deptForm: {
        parentId: [null],
        deptName: "",
        user: "",
        userName: "",
        userEmail: "",
        userId: "",
      },
      deptList: [],
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
        },
        {
          label: "负责人",
          prop: "userName",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
        {
          label: "创建时间",
          prop: "updateTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      rules: {
        parentId: [
          { required: true, message: "请选择上级部门", trigger: "blur" },
        ],
        deptName: [
          { required: true, message: "请选择部门名称", trigger: "blur" },
        ],
        user: [{ required: true, message: "请选择负责人", trigger: "blur" }],
      },
    };
  },
  watch: {
    "deptForm.user"(newVal, oldVal) {
      this.deptForm.userEmail = newVal.split("/")[2];
      this.deptForm.userName = newVal.split("/")[1];
      this.deptForm.userId = newVal.split("/")[0];
    },
  },
  mounted() {
    this.handleQueryList({ ...this.queryForm });
    this.getAllUserList();
  },
  methods: {
    async getAllUserList() {
      this.userList = await this.$api.getAllUserList();
    },
    async handleQueryList(params) {
      this.deptList = await this.$api.getDeptList(params);
    },
    handleCreateOpen() {
      this.action = "create";
      this.dialogTitle = "创建部门";
      this.showCreateWin = true;
    },
    handleEdit(row) {
      this.$nextTick(() => {
        this.deptForm = Object.assign(this.deptForm, {
          ...row,
          user: `${row.userId}/${row.userName}/${row.userEmail}`,
        });
        this.action = "edit";
        this.dialogTitle = "编辑部门";
        this.showCreateWin = true;
      });
    },
    async handleDel(_id) {
      this.action = "delete";
      try {
        await this.$api.deptOperate({ _id, action: this.action });
        this.$message.success("删除成功");
        this.handleQueryList({ ...this.queryForm });
      } catch (error) {
        this.$message.error(error);
      }
    },
    handleSubmit() {
      this.$refs["dialogForm"].validate(async (val) => {
        if (val) {
          try {
            let params = {
              ...this.deptForm,
              userName: this.deptForm.user.split("/")[1],
              userEmail: this.deptForm.user.split("/")[2],
              userId: this.deptForm.user.split("/")[0],
              action: this.action,
            };
            delete params.user;
            await this.$api.deptOperate(params);
            this.handleCancle();
            this.action === "create" && this.$message.success("创建成功");
            this.action === "edit" && this.$message.success("编辑成功");
            this.handleQueryList({ ...this.queryForm });
          } catch (error) {
            this.$message.error(error);
          }
        }
      });
    },
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleCancle() {
      this.handleReset("dialogForm");
      this.showCreateWin = false;
    },
  },
};
</script>
