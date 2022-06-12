/**
 * API管理
 */
import request from "./../utils/request";
export default {
  login(params) {
    return request({
      //要将请求回来的数据返回出去
      url: "/users/login",
      data: params,
      method: "post",
    });
  },
  noticeCount() {
    return request({
      //要将请求回来的数据返回出去
      url: "/leave/count",
      data: {},
      method: "get",
      // mock: true,
    });
  },
  getMenuList(params) {
    return request({
      //要将请求回来的数据返回出去
      url: "/menu/list",
      data: params,
      method: "get",
    });
  },
  getPerssionList() {
    return request({
      //要将请求回来的数据返回出去
      url: "/users/getPerssionList",
      data: {},
      method: "get",
    });
  },
  getRoleList(params) {
    return request({
      //要将请求回来的数据返回出去
      url: "/roles/list",
      data: params,
      method: "get",
      // mock: true,
    });
  },
  getUserList(params) {
    return request({
      //要将请求回来的数据返回出去
      url: "/users/list",
      data: params,
      method: "get",
    });
  },
  userSumbit(params) {
    return request({
      url: "/users/operate",
      data: params,
      method: "post",
    });
  },
  getRoleAllList() {
    return request({
      //要将请求回来的数据返回出去
      url: "/roles/allList",
      data: {},
      method: "get",
    });
  },
  getDeptList(params) {
    return request({
      //要将请求回来的数据返回出去
      url: "/dept/list",
      data: params,
      method: "get",
      // mock: true,
    });
  },
  deptOperate(params) {
    return request({
      //要将请求回来的数据返回出去
      url: "/dept/operate",
      data: params,
      method: "post",
      // mock: true,
    });
  },
  userDel(params) {
    return request({
      //要将请求回来的数据返回出去
      url: "/users/delete",
      data: params,
      method: "post",
    });
  },
  menuSumbit(params) {
    return request({
      url: "/menu/operate",
      data: params,
      method: "post",
    });
  },
  roleSumbit(params) {
    return request({
      url: "/roles/operate",
      data: params,
      method: "post",
    });
  },
  updataPermission(params) {
    return request({
      url: "/roles/update/permission",
      data: params,
      method: "post",
    });
  },
  getAllUserList(params) {
    return request({
      url: "/users/all/list",
      data: params,
      method: "get",
      // mock: true,
    });
  },
  getApplyList(params) {
    return request({
      url: "/leave/list",
      data: params,
      method: "get",
      mock: false,
    });
  },
  leaveOperate(params) {
    return request({
      url: "/leave/operate",
      method: "post",
      data: params,
      // mock: true,
    });
  },
  leaveApprove(params) {
    return request({
      url: "/leave/approve",
      method: "post",
      data: params,
      // mock: true,
    });
  },
};
