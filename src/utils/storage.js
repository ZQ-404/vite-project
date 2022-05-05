/**
 * storage二次封装
 * @author zhaoqin
 */
import config from "../config";
export default {
  setItem(key, val) {
    let storage = this.getStorage();
    storage[key] = val;
    window.localStorage.setItem(config.namespace, JSON.stringify(storage));
  },
  getItem(key) {
    return this.getStorage()[key];
  },
  getStorage() {
    return JSON.parse(window.localStorage.getItem(config.namespace)||'{}');
  },
  clearItem(key) {
      //删除
      let storage=this.getStorage();
      delete storage[key];
      //再次存入
      window.localStorage.setItem(config.namespace,JSON.stringify(storage))
  },
  clearAll() {
      window.localStorage.clear();
  },
};
