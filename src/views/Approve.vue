<template>
  <div class="user-manger">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryForm">
        <el-form-item prop="applyState" label="审批状态">
          <el-select
            placeholder="请选择审批状态"
            v-model="queryForm.applyState"
          >
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">确定</el-button>
          <el-button @click="handleReset('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <el-table :data="applyList">
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
            <el-button
              @click="handleDialog(scope.row)"
              size="small"
              v-if="
                scope.row.curAuditUserName === userInfo.userName &&
                [1, 2].includes(scope.row.applyState)
              "
              >审核</el-button
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
    <el-dialog v-model="showDetails" title="审核" width="50%">
      <el-form
        label-width="120px"
        label-suffix=":"
        :model="auditForm"
        ref="dialogForm"
        :rules="rules"
      >
        <el-form-item label="申请人">{{
          detail.applyUser.userName
        }}</el-form-item>
        <el-form-item label="休假类型">{{ detail.applyTypeName }}</el-form-item>
        <el-form-item label="休假时间">{{ detail.time }}</el-form-item>
        <el-form-item label="休假时长">{{ detail.leaveTime }}</el-form-item>
        <el-form-item label="休假原因">{{ detail.reasons }}</el-form-item>
        <el-form-item label="审批状态">{{
          detail.applyStateName
        }}</el-form-item>
        <el-form-item label="当前审批人">{{
          detail.curAuditUserName
        }}</el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入审核备注"
            v-model="auditForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleApprove('pass')">审核通过</el-button>
          <el-button type="primary" @click="handleApprove('refuse')"
            >驳回</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import utils from "../utils/utils";
export default {
  name: "Approve",
  setup() {
    //获取composition API的上下文对象
    const { proxy, ctx } = getCurrentInstance();
    const queryForm = reactive({
      applyState: 1,
    });
    const columns = reactive([
      {
        label: "单号",
        prop: "orderNo",
      },
      {
        label: "申请人",
        prop: "",
        formatter(row) {
          return row.applyUser.userName;
        },
      },
      {
        label: "单号",
        prop: "orderNo",
      },
      {
        label: "休假时间",
        prop: "",
        width: 200,
        formatter: (row, column, value) => {
          return (
            utils.formateDate(new Date(row.startTime), "yyyy-MM-dd") +
            "到" +
            utils.formateDate(new Date(row.endTime), "yyyy-MM-dd")
          );
        },
      },
      {
        label: "休假时长",
        prop: "leaveTime",
      },
      {
        label: "休假类型",
        prop: "applyType",
        formatter(row, column, value) {
          return {
            1: "事假",
            2: "调休",
            3: "年假",
          }[value];
        },
      },
      {
        label: "休假原因",
        prop: "reasons",
      },
      {
        label: "申请时间",
        prop: "createTime",
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value), "yyyy-MM-dd");
        },
      },
      {
        label: "审批人",
        prop: "auditUsers",
      },
      {
        label: "当前审批人",
        prop: "curAuditUserName",
      },
      {
        label: "审批状态",
        prop: "applyState",
        formatter: (row, column, value) => {
          return {
            1: "带审批",
            2: "审批中",
            3: "审批拒绝",
            4: "审批通过",
            5: "作废",
          }[value];
        },
      },
    ]);
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    });
    const applyList = ref([]);
    const leaveForm = reactive({
      applyType: 1,
      startTime: "",
      endTime: "",
      leaveTime: "0天",
      reasons: "",
    });
    const auditForm = reactive({ remark: "" });
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    const action = ref("");
    const rules = {
      remark: [
        {
          required: true,
          message: "请输入备注内容",
          trigger: "change",
        },
      ],
    };
    const params = ref({});
    const showDetails = ref(false);
    const detail = ref({});
    // 查询休假列表
    const getApplyList = async () => {
      params.value = { ...queryForm, ...pager, type: "approve" };
      let { list, page } = await proxy.$api.getApplyList(params.value);
      applyList.value = list;
      pager.total = page.total;
    };
    //打开审核弹框
    const handleDialog = (row) => {
      let data = { ...row };
      data.applyTypeName = {
        1: "事假",
        2: "调休",
        3: "事假",
      }[data.applyType];
      data.time =
        utils.formateDate(new Date(data.startTime), "yyyy-MM-dd") +
        "到" +
        utils.formateDate(new Date(data.endTime), "yyyy-MM-dd");
      data.applyStateName = {
        1: "带审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[data.applyState];
      detail.value = data;
      showDetails.value = true;
    };
    //关闭审核弹框
    const handleClose = () => {
      showDetails.value = false;
      detail.value = {};
      auditForm.remark = "";
    };
    const handleApprove = (action, _id) => {
      proxy.$refs.dialogForm.validate(async (validata) => {
        if (validata) {
          try {
            let params = { ...auditForm, action, _id: detail.value._id };
            await proxy.$api.leaveApprove(params);
            proxy.$message.success("操作成功");
            handleClose();
            getApplyList();
          } catch (error) {
            proxy.$message.error(error);
          }
        }
      });
    };

    const handleCurrentChange = (current) => {
      pager.pageNum = current;
    };

    //初始化
    onMounted(() => {
      getApplyList();
    });

    return {
      queryForm,
      auditForm,
      columns,
      pager,
      params,
      applyList,
      leaveForm,
      userInfo,
      showDetails,
      action,
      rules,
      detail,
      getApplyList,
      handleCurrentChange,
      handleApprove,
      handleClose,
      handleDialog,
    };
  },
};
</script>
