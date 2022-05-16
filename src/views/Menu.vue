<template>
  <div class="menu-manger">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item prop="menuName" label="菜单名称">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item prop="menuState" label="菜单状态">
          <el-select v-model="queryForm.menuState" placeholder="请输入菜单状态">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="p20 white">
      <el-button type="primary" @click="handleAdd(1, {})">新增</el-button>
    </div>

    <el-table :data="menuList" row-key="_id">
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :formatter="item.formatter"
      />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            @click="handleAdd(2, scope.row)"
            size="small"
            type="primary"
            >新增</el-button
          >
          <el-button @click="handleEdit(scope.row)" size="small"
            >编辑</el-button
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
    <el-dialog v-model="showModal" title="用户新增">
      <el-form
        :model="menuForm"
        label-width="80"
        :rules="rules"
        ref="dialogForm"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          />
          <span>不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-if="menuForm.menuType === 1"
        >
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="path"
          v-if="menuForm.menuType === 1"
        >
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="path"
          v-if="menuForm.menuType === 2"
        >
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-if="menuForm.menuType === 1"
        >
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item
          label="菜单状态"
          prop="roleList"
          v-if="menuForm.menuType === 1"
        >
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门" prop="deptId" v-if="menuForm.menuType === 1">
          <el-cascader
            v-model="menuForm.deptId"
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
import utils from "./../utils/utils";
export default {
  name: "Menu",
  data() {
    return {
      showModal: false,
      action: "",
      queryForm: {},
      menuForm: {
        menuState: 1,
        menuType: 1,
        parentId: [null],
      },
      columns: [
        {
          prop: "menuName",
          label: "菜单名称",
          width: 180,
        },
        {
          prop: "icon",
          label: "图标",
        },
        {
          prop: "menuType",
          label: "菜单类型",
          formatter(row, column, value) {
            return {
              1: "菜单",
              2: "按钮",
            }[value];
          },
        },
        {
          prop: "menuCode",
          label: "权限标识",
        },
        {
          prop: "path",
          label: "路由地址",
        },
        {
          prop: "component",
          label: "组件地址",
        },
        {
          prop: "menuState",
          label: "菜单状态",
          formatter(row, column, value) {
            return {
              1: "正常",
              2: "停用",
            }[value];
          },
        },
        {
          prop: "createTime",
          label: "创建时间",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      menuList: [],
      rules: {
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度2-8", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    handleQuery() {
      this.getMenuList();
    },
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (val) => {
        if (val) {
          try {
            let { action, menuForm } = this;
            let params = { ...menuForm, action };
            let res = await this.$api.menuSumbit(params);
            this.showModal = false;
            this.$message.success("操作成功");
            this.handleReset("dialogForm");
            this.getMenuList();
          } catch (error) {
            this.$message.fail("操作失败");
          }
        }
      });
    },
    //初始化列表
    async getMenuList() {
      try {
        this.menuList = await this.$api.getMenuList(this.queryForm);
      } catch (error) {
        throw new Error(e);
      }
    },
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "add";
      if (type === 2) {
        this.menuForm.parentId = [...row.parentId, row._id].filter(
          (item) => item
        );
      }
    },
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.menuForm, row);
      });
    },
    async handleDel(_id) {
      await this.$api.menuSumbit({ _id, action: "delete" });
      this.$message.success("删除成功");
      this.getMenuList();
    },
  },
};
</script>
