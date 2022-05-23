<template>
  <a-layout class="mission">
    <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '540px' }">
      <a-breadcrumb class="item-title">
        <a-breadcrumb-item>业务模块</a-breadcrumb-item>
        <a-breadcrumb-item>文章管理</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="nav">
        <a-icon style="margin-right: 5px;cursor: pointer" type="plus" @click="addMission"/><span style="cursor: pointer" @click="addMission">发布文章</span>
      </div>
      <div class="container">
        <a-tabs v-model="tabKey" @change="selectType" style="min-width: 850px">
          <a-tab-pane tab="已发布" key="1">
            <div class="box" v-for="(item,index) in missionList" :key="index" >
              <a-row>
                <a-col :span="3" style="min-width: 120px">
                  <img style="width: 120px;height: 80px" :src="item.coverImage.imageUrl" alt="">
                </a-col>
                <a-col :span="17">
                  <div style="margin-left: 15px;cursor: pointer" @click="showDetail(item)">
                    <p class="title">{{item.articleTitle}}</p>
                    <p><span class="untilName">{{item.createUnitName}}</span><span class="date">{{item.date}}</span></p>
                  </div>
                </a-col>
                <a-col :span="2">
                  <div class="action">
                    <a-popconfirm
                            title="确定下架该文章?"
                            @confirm="confirmUpdate(item.articleId)"
                            okText="是"
                            cancelText="否"
                    >
                      <a-icon style="font-size: 24px;margin-right: 5px;cursor: pointer;vertical-align: sub" twoToneColor="#1890ff" theme="twoTone" type="diff" />
                      <a href="javascript:void(0)">下架</a>
                    </a-popconfirm>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="未发布" key="2" forceRender>
            <div class="box" v-for="(item,index) in missionList" :key="index">
              <a-row>
                <a-col :span="2" style="min-width: 120px">
                  <img style="width: 120px;height: 80px" :src="item.coverImage.imageUrl" alt="">
                </a-col>
                <a-col :span="18">
                  <div style="margin-left: 15px">
                    <p class="title">{{item.articleTitle}}</p>
                    <p><span class="untilName">{{item.createUnitName}}</span><span class="date">{{item.date}}</span></p>
                  </div>
                </a-col>
                <a-col :span="2">
                  <div class="action">
                    <a-icon style="font-size: 24px;margin-right: 20px;cursor: pointer" twoToneColor="#1890ff" theme="twoTone" type="edit" @click="editMission(item)"/>
                    <a-popconfirm
                            title="确定删除该文章?"
                            @confirm="delMission(item.articleId)"
                            okText="是"
                            cancelText="否"
                    >
                      <a-icon style="font-size: 24px;cursor: pointer" twoToneColor="#D81E06FF" theme="twoTone" type="delete" />
                    </a-popconfirm>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-layout-content>
    <a-modal
            width="60%"
            :title="missionTitle"
            v-model="addFlag"
            :footer="null"
    >
      <a-form :form="form" class="formBox">
        <div>
          <a-form-item label="标题"
                       :label-col="formItemLayout.newLabelCol"
                       :wrapper-col="formItemLayout.wrapperCol">
            <a-input placeholder="请输入" v-decorator="['title',{rules: [{ required: true, message: '请填写主标题!' }]}]"></a-input>
          </a-form-item>
          <a-form-item label="封面"
                       :label-col="formItemLayout.newLabelCol"
                       :wrapper-col="formItemLayout.wrapperCol">
            <a-upload
                    :beforeUpload="beforeUpload"
                    listType="picture-card"
                    :showUploadList="false"
                    @change="handleUpload"
                    v-decorator="['previewImage',{rules: [{ required: false, message: '请上传封面!' }]}]"
            >
              <img style="width: 128px;height: 128px;" v-if="previewImage" :src="previewImage" alt="avatar" />
              <div v-else>
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item label="文章内容"
                       :label-col="formItemLayout.newLabelCol"
                       :wrapper-col="formItemLayout.wrapperCol">
            <quill ref="quill"></quill>
          </a-form-item>
        </div>
        <div class="btn">
          <a-button style="margin-right: 10px" @click="addFlag = false">取消</a-button>
          <a-button style="margin-right: 10px" @click="saveMission(1)">保存</a-button>
          <a-button type="primary" @click="saveMission(2)">发布</a-button>
        </div>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script>
  import api from '../../api/interface'
  import quill from '../../components/quill'
  import 'quill/dist/quill.snow.css'
  const formItemLayout = {
    wrapperCol: { span: 16 },
    newLabelCol: { span: 4 }
  };
  export default {
    components: {
      quill
    },
    data () {
      return {
        formItemLayout,
        pagination: false,
        addFlag: false,
        pageSize: 15,
        pageNum: 1,
        total: 0,
        content: '',
        showContent: '',
        previewImage: '',
        previewId: '',
        tabKey: '1',
        articleStatus: 1,
        title: '',
        keyWord: '',
        currentFile: '',
        fileList: [],
        id: '',
        unitType: [],
        missionList: [],
        missionTitle: '新建文章',
        columns: [
          {
            title: '标题',
            dataIndex: 'title',
            align: 'center'
          },
          {
            title: '公告对象',
            align: 'center',
            scopedSlots: { customRender: 'unitType' },
          },
          {
            title: '生效时间',
            dataIndex: 'beginTime',
            align: 'center'
          },
          {
            title: '失效时间',
            dataIndex: 'endTime',
            align: 'center',
          },
          {
            title: '状态',
            align: 'center',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this)
    },
    methods: {
      //选择类型
      selectType(val){
        this.tabKey = val
        if(val == '1'){
          //已发布
          this.articleStatus = 1;
          this.searchArticleList()
        }else{
          this.articleStatus = 0;
          this.searchArticleList()
        }
      },
      //取消预览
      handleCancel() {
        this.previewVisible = false;
      },
      //预览
      handlePreview(file) {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
      },
      //删除图片
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList
      },
      beforeUpload(file) {
        this.currentFile = file;
        this.fileList = [...this.fileList, file]
        return false;
      },
      //上传图片
      handleUpload() {
        let formData = new FormData();
        formData.append('file', this.currentFile);
        this.$Utils
          .commonAjax({
            url: api.interfaceConfig.upload,
            type: 'POST',
            data: formData,
            flag: true
          }).then(res => {
            if (res.success) {
              this.previewImage = res.result ? res.result[0].imageUrl : '';
              this.previewId = res.result ? res.result[0].imageId : '';
              this.fileList[this.fileList.length-1].url = this.previewImage
              this.$message.success('上传成功');
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch(err => {
          })
      },
      // 下架
      confirmUpdate(id){
        let params = {
          articleStatus: 0,
          articleId: id,
        }
        this.$Utils
          .commonAjax({
            url: api.interfaceConfig.updateMission,
            data: params,
            type: 'POST',
            flag: true
          }).then(res => {
            if (res.success) {
              this.selectPagination(1)
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch(err => {
          })
      },
      //分页
      selectPagination(pageNum){
        this.pageNum = pageNum;
        this.searchArticleList();
      },
      //文章列表
      searchArticleList(){
        let params = {
          articleStatus: this.articleStatus,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
        this.$Utils
          .commonAjax({
            url: api.interfaceConfig.getArticleList,
            data: params,
            type: 'POST',
            flag: true
          }).then(res => {
            if (res.success) {
              this.missionList = res.result ? res.result.list : []
              this.total = res.result ? res.result.total : 0
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch(err => {

          })
      },
      //详情页
      showDetail(item){
        this.$router.push({name: 'detailMission',params:{data: item}})
      },
      //新建
      addMission(){
        this.addFlag = true;
        this.missionTitle = '新建文章';
        this.previewImage = '';
        this.$nextTick(()=>{
          this.form.setFieldsValue({title:'',subtitle: '',previewImage: ''});
          this.$refs.quill.setContents()
        })
      },
      //编辑
      editMission(row){
        console.log(row)
        this.addFlag = true;
        this.missionTitle = '编辑文章';
        this.id = row.articleId;
        this.missionDetail(this.id)
      },
      // 查询文章详情
      missionDetail(id){
        let params = {
          articleId: id,
        }
        this.$Utils
            .commonAjax({
              url: api.interfaceConfig.missionDetail,
              type: 'POST',
              data: params,
              flag: true
            }).then(res => {
              if (res.success) {
                const data = res.result
                this.previewImage = data.coverImage.imageUrl;
                const content = window.JSON.parse(data.articleContent)
                console.log(content)
                this.$nextTick(()=>{
                  this.form.setFieldsValue({title:data.articleTitle,previewImage: data.coverImage.imageUrl})
                  this.$refs.quill.setContents(content)
                })

              } else {
                this.$message.warning(res.msg)
              }
            })
            .catch(err => {
            })
      },
      //删除
      delMission(id){
        let params = {
          articleId: id,
        }
        this.$Utils
          .commonAjax({
            url: api.interfaceConfig.deleteMission,
            type: 'POST',
            data: params,
            flag: true
          }).then(res => {
            if (res.success) {
              this.selectPagination(1);
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch(err => {
          })
      },
      //新增提交
      saveMission (type) {
        // e.preventDefault()
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            console.log(err)
            return
          }else{
            this.content = window.JSON.stringify(this.$refs.quill.getContents());
            this.showContent = this.$refs.quill.getHtml();
            let params = {
              openid: 'admin',
              articleTitle: fieldsValue['title'],
              coverImage: {
                imageId: this.previewId
              },
              articleContent: this.content,
              showContent: this.showContent
            }
            if(type == 1){
              params.articleStatus = 0
            }else{
              params.articleStatus = 1
            }
            let url = ''
            if(this.missionTitle == '新建文章'){
              url = api.interfaceConfig.addMission
            }else{
              params.articleId = this.id;
              url = api.interfaceConfig.updateMission
            }
            this.$Utils
              .commonAjax({
                url: url,
                type: 'POST',
                data: params,
                flag: true
              }).then(res => {
                if (res.success) {
                  this.addFlag = false;
                  if(type == 1){
                    //保存
                    this.selectType('2');
                  }else{
                    this.selectType('1');
                  }
                } else {
                  this.$message.warning(res.msg)
                }
              })
              .catch(err => {

              })
          }
        })
      },
    },
    mounted () {
      this.searchArticleList()
    }
  }
</script>

<style lang="less" scoped>
  .mission{
    .item-title {
      margin-bottom: 40px;
    }
    .nav{
      width: 100%;
      height: 63px;
      line-height: 63px;
      text-align: center;
      background-color: #fafafa;
      margin-bottom: 10px;
    }
    .container{
      background-color: #fafafa;
      overflow-x: scroll;

      .box{
        height: 112px;
        padding-top: 10px;
        padding-left: 16px;
      }
      .box:hover{
        background-color: #fff;
      }
      .title{
        font-size:16px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(0,12,23,1);
      }
      .untilName{
        margin-right: 30px;
        color:rgba(138,138,138,1);
      }
      .date{
        color:rgba(138,138,138,1);
      }
      .action{
        height: 82px;
        line-height: 82px;
      }
    }
    .actionbtn{
      display: inline-block;
      width: 55px;
    }
    .br{
      border-right: 1px solid #eeeeee;
      padding-right: 10px;
    }

  }
  .btn{
    display: flex;
    justify-content: flex-start;
    margin-top: 30px;
    padding-left: 110px;
  }

</style>
<style>
  .formBox .ant-form-item{
    margin-bottom: 5px !important;
  }
  .ql-container{
    max-height: 200px;
    overflow-y: auto;
  }
</style>
