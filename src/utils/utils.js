/**
 * 工具函数封装
 */

export default {
  formateDate(date, rule) {
    let fmt = rule || "yyyy-MM-dd hh:mm:ss";
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear());
    }
    const o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
    };
    for (const key in o) {
      if (new RegExp(`(${key})`).test(fmt)) {
        const val = o[key] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? val : ("00" + val).substring(val.length)
        );
      }
    }
    return fmt;
  },
  generateRoute(list) {
    let routes = [];
    const deepList = (list) => {
      while (list.length) {
        let item = list.pop();
        if (item.action) {
          routes.push({
            name: item.component,
            path: item.path,
            meta: {
              title: item.menuName,
            },
            component: item.component,
          });
        }
        if (item.children && !item.action) {
          deepList(item.children);
        }
      }
    };
    deepList(list);
    return routes;
  },
};
