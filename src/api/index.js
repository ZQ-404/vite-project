/**
 * API管理
 */
import request from "./../utils/request";
export default {
  login(params) {
    return request({  //要将请求回来的数据返回出去
      url: "/users/login",
      data: params,
      method:'post',
    });
  },
  noticeCount() {
    return request({  //要将请求回来的数据返回出去
      url: "/leave/count",
      data: {},
      method:'get',
      mock:true,
    });
  },
  getMenuList() {
    return request({  //要将请求回来的数据返回出去
      url: "/menu/list",
      data: {},
      method:'get',
      mock:true,
    });
  },
  getUserList(params){
    return request({  //要将请求回来的数据返回出去
      url: "/users/list",
      data: params,
      method:'post',
      mock:true,
    });
  },
  userDel(params){
    return request({  //要将请求回来的数据返回出去
      url: "/users/delte",
      data: params,
      method:'post',
      mock:true,
    });
  }
};
