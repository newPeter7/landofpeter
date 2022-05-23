import Mock from 'mockjs';
import * as interfaces from './interface';

//公共接口
const common = {
  //上传Form图片
  uploadImg:{
    retCode: '0',
    data: Mock.mock({
      "carouselList|20": [{
        'createTime': '@date("yyyy-MM-dd")',
        'carouselTitle': '@name',
        'carouselPic': "@dataImage('200x100', 'Hello Mock.js!')",
        'id': '@increment',
        'jumpUrl': '@url',
        'isShowClient|0-1': 1,
        'state|0-1': 1,
        'closeTime': '@date("yyyy-MM-dd")',
      }],
      'listCount': 20
    })
  }
}

//观赛券发放订单管理
const couponServiceOrderMgt = {
  queryServiceOrderList: {
    retCode: '0',
    data: Mock.mock({
      "datas|20": [{
        'canReissueSms|0-1': true,
        'couponIds': /[\d,]{5}/,
        'mobile': /1[\d]{10}/,
        'orderId': '@increment',
        'orderStatus|0-1': 1,
        'serviceOrderId': '@natural',
        'smsSendCount|0-5': 5,
        'smsStatus': /01|02|/,
        'totalNum|1-50': 50,
        'userType|0-1': 1,
        'userId': '@name',
        'activityId': '@increment',
        'createDate': '@date("yyyy-MM-dd")',
      }],
      'totalDataCount': 40
    })
  },

  reissueSms: {
    retCode: '0',
    data:Mock.mock({
      'success|1-2': true,
      'retMsg': /100|101/
    })
  }
}


const output = {
  common,
  couponServiceOrderMgt,
};

Object.keys(output).forEach(key => {
  if (interfaces.hasOwnProperty(key)) {
    if (typeof output[key] != 'string') {
      Object.keys(output[key]).forEach(item => {
        interfaces[key][item] = output[key][item];
      })
    }
  }
});

export default {
  ...interfaces
}
