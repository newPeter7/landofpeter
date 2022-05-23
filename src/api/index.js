import * as interfaces from 'interfaces';
import {
  http
} from 'util';

let _interfaces = interfaces;
if (interfaces.hasOwnProperty('default')) {
  _interfaces = interfaces.default;
}

/**
 * 调用api代理类
 * 1、自动将服务端接口包装成ajax请求，支持get/post/jsonp配置
 * 2、根据config中mock配置，wp动态加载响应文件，自动切换请求数据源
 */
function api() {}
Object.keys(_interfaces).forEach(key => {
  Object.keys(_interfaces[key]).forEach(item => {
    api[item] = (data) => {
      let url = _interfaces[key][item].url || _interfaces[key][item];
      let options = {
        data: data,
        ..._interfaces[key][item]
      };
      //console.log(options);
      if (Object.prototype.toString.call(url) == '[object String]') {
        return http(options);
      } else {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (url.retCode == '0') {
              resolve(url.data)
            } else {
              reject(url.data);
            }
          }, 10)
        })
      }
    }
  })
})

export default api
