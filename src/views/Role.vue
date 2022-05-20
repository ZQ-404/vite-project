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
            <el-button size="small" @click="powerEdit(scope.row)"
              >设置权限</el-button
            >
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
    <!-- 角色新增弹框 -->
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
    <!-- 权限编辑弹框 -->
    <el-dialog v-model="showPower" title="权限编辑">
      <el-form :model="powerForm" label-width="100" ref="permissionForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="powerForm.roleName" disabled />
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="_id"
            ref="tree"
            default-expand-all
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handlePowerClose">取 消</el-button>
          <el-button type="primary" @click="handlePowerSubmit">确 定</el-button>
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
      showPower: false,
      showModal: false,
      powerList: [],
      roleList: [],
      testList: [],
      powerForm: {
        roleName: "",
        permissionList: { checkedKeys: [], halfCheckedKeys: [] },
      }, //权限表单内容
      roleForm: {
        roleName: "",
        remark: "",
      },
      menuList: [],
      defaultProps: {
        children: "children",
        label: "menuName",
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
          prop: "createTime",
          label: "创建时间",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
        {
          prop: "updateTime",
          label: "修改时间",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
        {
          prop: "permissionList",
          label: "权限列表",
          formatter: (row, column, value) => {
            return this.getFormatter(value);
          },
        },
      ],
      //   权限映射表
      actionMap: {},
    };
  },
  mounted() {
    this.getMenuList();
    this.getRoleList();
  },
  methods: {
    getFormatter(value) {
      let names = [];
      let list = value.halfCheckedKeys.concat(value.checkedKeys) || [];
      list.map((key) => {
        let actionMap = JSON.parse(JSON.stringify(this.actionMap));
        let name = actionMap[key];
        if (key && name) names.push(name);
      });
      return names.join(",");
    },
    handleCurrentChange(current) {
      this.pager.pageNum = current;
      this.getRoleList();
    },
    async getMenuList() {
      this.menuList = await this.$api.getMenuList({});
      this.getActionMap(this.menuList);
    },
    async handlePowerSubmit() {
      const nodeList = this.$refs["tree"].getCheckedNodes();
      const halfList = this.$refs["tree"].getHalfCheckedKeys();
      const checkedList = [];
      const parentList = [];
      nodeList.map((node) => {
        if (!!node.children) {
          // 按钮
          checkedList.push(node._id);
        } else {
          // 菜单管理
          parentList.push(node._id);
        }
      });
      let params = {
        _id: this.powerForm._id,
        permissionList: {
          checkedKeys: checkedList,
          halfCheckedKeys: parentList.concat(halfList),
        },
      };
      await this.$api.updataPermission(params);
      this.getRoleList();
      this.handleReset("permissionForm");
      this.showPower = false;
      this.$message.success("权限设置成功");
    },

    handlePowerClose() {
      this.handleReset("permissionForm");
      this.showPower = false;
    },
    powerEdit(row) {
      this.showPower = true;
      this.powerForm = JSON.parse(JSON.stringify(row));
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(row.permissionList.checkedKeys);
      }, 0);
    },
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
            await this.$api.roleSumbit(params);
            this.showModal = false;
            this.$message.success("操作成功");
            this.handleReset("dialogForm");
            this.getRoleList();
          } catch (error) {
            this.$message.error("操作失败");
          }
        }
      });
    },
    //拿权限展示
    getActionMap(list) {
      let actionMap = {};
      let arr = JSON.parse(JSON.stringify(list));
      while (arr.length) {
        let item = arr.pop();
        if (item.children && item.action) {
          actionMap[item._id] = item.menuName;
        }
        if (item.children && !item.action) {
          this.getActionMap(item.children);
        }
      }
      //递归，会出现空值覆盖的现象，所以最好合并
      this.actionMap = Object.assign(this.actionMap, actionMap);
    },
    //初始化列表
    async getRoleList() {
      try {
        const res = await this.$api.getRoleList({
          ...this.queryForm,
          ...this.pager,
        });
        this.roleList = res.list;
        this.pager = res.page;
      } catch (error) {
        throw new Error(error);
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
