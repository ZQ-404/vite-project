export default {
  data() {
    return {
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  mounted() {},
  methods: {
    handleQueryList() {
      throw Error("handleQueryList方法没定义");
    },
    handleCurrentChange(currentPage) {
      pager.pageNum = currentPage;
      this.handleQueryList();
    },
  },
};
