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
      mock: true,
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
  getRoleList(params) {
    return request({
      //要将请求回来的数据返回出去
      url: "/roles/list",
      data: params,
      method: "get",
      mock: true,
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
      mock: true,
    });
  },
  getDeptList() {
    return request({
      //要将请求回来的数据返回出去
      url: "/dept/list",
      data: {},
      method: "get",
      mock: true,
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
      mock: true,
    });
  },
  updataPermission(params) {
    return request({
      url: "/roles/update/permission",
      data: params,
      method: "post",
      mock: true,
    });
  },
};
