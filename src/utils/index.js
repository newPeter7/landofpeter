import interfaceConfig from '../api/interface';
import axios from "axios";
// import {
//   jsonpToJson
// } from "../common/js/common";
import qs from "qs";
import router from '../view/router'
axios.defaults.withCredentials = true;

export default {

  /**
   *ajax promise， 无需验证登陆的接口
   * @param {*} param
   * @returns promise
   */
  commonAjax(param) {
    // let token = JSON.parse(JSON.stringify(window.localStorage.getItem('token')));
    let token = window.localStorage.getItem('token');
    let ajaxData = {
      url: param.url,
      method: param.type || "get",
      headers: {
         "X-Requested-With":"xmlhttprequest",
        }
    };
    if(token != '' && token !=null ){
      ajaxData.headers.Authorization = token
    }
    if(param.flag){
      ajaxData.withCredentials = false;
      ajaxData.headers['Content-Type'] = "application/json"
    }
    let that = this;
    ajaxData.method.toUpperCase() === "GET" ?
      (ajaxData.params = param.data) :
      param.flag ?
      (ajaxData.data = param.data) :
      (ajaxData.data = qs.stringify(param.data));
    return new Promise((resolve, reject) => {
      axios(ajaxData).then(res => {
        let data = {}
        data = res.data || {};
        resolve(data);
        // typeof res.data === 'string' ? data = jsonpToJson(res.data) : data = res.data || {}
      }).catch(err => {
        console.log(err);
        let text = err.responseText && JSON.parse(err.responseText) || {};
        if (err.status == 200 && text && text.idsIntercepted) {
          console.log("err")
        } else {
          reject(err);
        }
      });;
    });
  },
  /**
   * 接口请求前需要验证登陆
   * @param {*} param
   * @returns
   */
  ensureLoginAjax(param) {
    let that = this;
    return Vue.jsonp(
      interfaceConfig.loginStatusUrl,
      {
        crossDomain: !0,
        cache: !1,
      }
      ).then(data => {
      if (data.hasLogin) {
        return that.commonAjax(param);
      } else {
        that.goToLoginPage();
      }
    });

  },
  /**
   * 跳转登录
   */
  goToLoginPage() {
    let passport ='';
    const origin = location.origin;
    if(origin.indexOf('local') >= 0 || origin.indexOf('xgpre') >= 0){
       //passport ='https://passportsit.cnsuning.com/ids/login?service=' + encodeURIComponent('http://slvsit.cnsuning.com/slv-web/auth') + '?targetUrl=';
      // passport ='https://passportpre.cnsuning.com/ids/login?service=' + encodeURIComponent('http://slvpre.cnsuning.com/slv-web/auth') + '?targetUrl=';
    }else if(origin.indexOf('pre') >= 0){
      // passport ='https://passportpre.cnsuning.com/ids/login?service=' + encodeURIComponent('http://slvxgpre.cnsuning.com/slv-web/auth') + '?targetUrl=';
    }
    location.href = passport + encodeURIComponent(location.href);
  },

  setCookie (cname, cvalue, exdays) {
    let d = new Date()
    d.setTime(d.getTime() + (exdays*24*60*60*1000))
    let expires = 'expires=' + d.toGMTString()
    document.cookie = cname + '=' + cvalue + '; ' + expires
  },
  getCookie (cname) {
    var name = cname + '='
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim()
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length)
    }
    return ''
  }


};
