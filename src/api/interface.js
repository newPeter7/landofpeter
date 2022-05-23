//BASE常量
// const BaseUrl = 'http://192.168.0.32';
const BaseUrl = 'https://www.honorvessel.cn:8082';
// const BaseUrl = 'http://api.huimu.com';
 // 接口
const interfaceConfig = {
  login: BaseUrl + '/user/login',//登录
  queryPray: BaseUrl + '/prayer/list',//
  addPray: BaseUrl + '/prayer/add',//
  updatePray: BaseUrl + '/prayer/update',//
  deletePray: BaseUrl + '/prayer/delete',//
  getArticleList: BaseUrl + '/article/list',//获取文章列表
  addMission: BaseUrl + '/article/add',//新增文章
  missionDetail: BaseUrl + '/article/get',//文章id获取文章
  updateMission: BaseUrl + '/article/update',//修改文章
  deleteMission: BaseUrl + '/article/delete',//删除文章
  imageList: BaseUrl + '/image/list',//图片列表
  deleteImage: BaseUrl + '/image/delete',//删除图片
  addTag: BaseUrl + '/sheep/tag/add',//新增羊圈标签
  deleteTag: BaseUrl + '/sheep/tag/delete',//删除羊圈标签
  tagList: BaseUrl + '/sheep/tag/list',//羊圈标签列表
  updateTag: BaseUrl + '/sheep/tag/update',//更新羊圈标签
  zoneList: BaseUrl + '/sheep/zone/list',//获取羊圈列表
  deleteZone: BaseUrl + '/sheep/zone/delete',//删除羊圈


  upload: BaseUrl + '/image/upload',//上传图片
}

export default{
  interfaceConfig
};
