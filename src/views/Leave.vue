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
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleApply" v-has:add="'leave-apply'"
          >申请休假</el-button
        >
      </div>
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
            <el-button @click="handleDetail(scope.row)" size="small"
              >查看</el-button
            >
            <el-button
              @click="handleDel(scope.row._id)"
              size="small"
              type="danger"
              v-if="[1, 2].includes(scope.row.applyState)"
              >作废</el-button
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
    <el-dialog v-model="showModal" title="申请休假" width="70%">
      <el-form
        :model="leaveForm"
        label-width="80"
        :rules="rules"
        ref="dialogForm"
      >
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType">
            <el-option :value="1" label="事假" />
            <el-option :value="2" label="调休" />
            <el-option :value="3" label="年假" />
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间" prop="" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime" required>
                <el-date-picker
                  placeholder="请选择开始日期"
                  v-model="leaveForm.startTime"
                  @change="(val) => handleDateChange('startTime', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime" required>
                <el-date-picker
                  placeholder="请选择结束日期"
                  v-model="leaveForm.endTime"
                  @change="(val) => handleDateChange('endTime', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" prop="" required>
          {{ leaveForm.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons" required>
          <el-input
            v-model="leaveForm.reasons"
            placeholder="请输入休假原因"
            type="textarea"
            :rows="3"
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
    <el-dialog
      v-model="showDetails"
      title="申请休假详情"
      width="50%"
      destroy-on-close
    >
      <el-steps
        :active="detail.applyState > 2 ? 3 : detail.applyState"
        finish-status="success"
        align-center
      >
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/审批拒绝/作废"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
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
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import utils from "../utils/utils";
export default {
  name: "User",
  setup() {
    //获取composition API的上下文对象
    const { proxy } = getCurrentInstance();
    const queryForm = reactive({
      applyState: "",
    });
    const columns = reactive([
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
    const showModal = ref(false);
    const action = ref("");
    const rules = reactive({
      startTime: [
        {
          type: "date",
          required: true,
          message: "请输入开始日期",
          trigger: "change",
        },
      ],
      endTime: [
        {
          type: "date",
          required: true,
          message: "请输入结束时间",
          trigger: "change",
        },
      ],
      reasons: [
        {
          required: true,
          message: "请输入休假原因",
          trigger: "change",
        },
      ],
    });
    const params = ref({});
    const showDetails = ref(false);
    const active = ref(0);
    const detail = ref({});
    // 查询休假列表
    const getApplyList = async () => {
      let params = { ...queryForm, ...pager };
      let { list, page } = await proxy.$api.getApplyList(params);
      applyList.value = list;
      pager.total = page.total;
    };
    // 申请休假-弹框展示
    const handleApply = () => {
      showModal.value = true;
      action.value = "create";
    };
    //弹框关闭
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    // 重置
    const handleReset = (formId) => {
      proxy.$refs[formId].resetFields();
    };
    //休假提交接口
    const handleSubmit = () => {
      params.value = { ...leaveForm, action: action.value };
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          leaveOperate();
        }
      });
      handleReset("dialogForm");
      getApplyList();
    };
    //休假
    const leaveOperate = async () => {
      await proxy.$api.leaveOperate(params.value);

      showModal.value = false;
      action.value === "create" && proxy.$message.success("休假申请提交成功!");
      action.value === "delete" && proxy.$message.success("休假申请作废成功!");
    };
    //休假时间计算
    const handleDateChange = (key, value) => {
      let { startTime, endTime } = leaveForm;
      if (!startTime || !endTime) return;
      if (startTime > endTime) {
        proxy.$message.error("开始时间不能晚于结束时间");
        leaveForm.leaveTime = "0天";
        setTimeout(() => {
          leaveForm[key] = "";
        }, 0);
      } else {
        leaveForm.leaveTime = `${
          (endTime - startTime) / 24 / 60 / 60 / 1000 + 1
        }天`;
      }
    };
    //查看详情
    const handleDetail = (curItem) => {
      let data = { ...curItem };
      data.applyTypeName = {
        1: "事假",
        2: "调休",
        3: "事假",
      }[data.dataType];
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
    //作废
    const handleDel = (_id) => {
      action.value = "delete";
      params.value = { _id, action };
      proxy
        .$confirm("作废该条休假申请，是否继续？", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          await leaveOperate();
          await getApplyList();
        });
    };
    //分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
    };

    //初始化
    onMounted(() => {
      getApplyList();
    });

    return {
      queryForm,
      columns,
      pager,
      applyList,
      leaveForm,
      showModal,
      showDetails,
      action,
      rules,
      active,
      detail,
      getApplyList,
      handleApply,
      handleClose,
      handleSubmit,
      handleDateChange,
      handleDetail,
      handleDel,
    };
  },
};
</script>
