<template>
  <a-layout class="userMgt">
    <a-layout-content :style="{ margin: '24px 16px', padding: '24px',background: '#fff', minHeight: '540px' }">
      <div>
        <a-button style="margin-bottom: 24px" type="primary" @click="addPray">+新增</a-button>
        <a-table :columns="columns" :dataSource="imageList" rowKey="prayerId" :pagination="pagination">
          <span slot="image" slot-scope="text, record">
            <img class="image" :src="text.imageUrl" alt="">
          </span>
          <span slot="action" slot-scope="text, record">
                  <a-popconfirm title="确定删除该条信息？" okText="确定" cancelText="取消" @confirm="delImage(record.imageId)">
                    <a href="javascript:void(0)" class="actionbtn red">删除</a>
                  </a-popconfirm>
                </span>
        </a-table>
        <div style="float: right;margin-top: 20px">
          <a-pagination showQuickJumper :defaultCurrent="1" :current="pageNum" :pageSize="pageSize" :total="total" @change="selectPagination" />
        </div>
      </div>
    </a-layout-content>
    <a-modal
            width="40%"
            :title="title"
            v-model="addFlag"
            cancelText="取消"
            okText="确认"
            @ok="handleSubmit"
    >
      <a-form :form="form">
        <a-form-item label="标题"
                     :label-col="formItemLayout.newLabelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input placeholder="请输入标题" :maxLength="20" v-decorator="['title',{rules: [{ required: true, message: '请输入标题!' }]}]"></a-input>
        </a-form-item>
        <a-form-item label="内容"
                     :label-col="formItemLayout.newLabelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input placeholder="请输入内容" type="textarea"　v-decorator="['content',{rules: [{ required: true, message: '请输入内容!' }]}]"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script>
  import api from '../../api/interface'

  const formItemLayout = {
    wrapperCol: { span: 14 },
    newLabelCol: { span: 7 }
  };
  export default {
    data () {
      return {
        formItemLayout,
        replaceFields:{
          key:'rowKey',
        },
        pagination: false,
        addFlag: false,
        title: '新增',
        imageList: [],
        pageSize: 15,
        pageNum: 1,
        total: 0,
        tableData: [],
        columns: [
          {
            title: '图片',
            scopedSlots: { customRender: 'image' },
            align: 'center',
            width: 400
          },
          {
            title: '时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 400
          },
          {
            title: '操作',
            align: 'center',
            scopedSlots: { customRender: 'action' },
            width: 300
          }
        ]
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this)
    },
    methods: {
      addPray(){
        this.addFlag = true;
        this.title ='新增';
        this.$nextTick(() => {
          this.form.setFieldsValue({title: '',content: ''})
        })
      },
      //分页
      selectPagination(pageNum){
        this.pageNum = pageNum;
        this.queryPray();
      },
      //查询
      queryPray(){
        let params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
        this.$Utils
          .commonAjax({
            url: api.interfaceConfig.imageList,
            data: params,
            type: 'POST',
            flag: true
          }).then(res => {
            if (res.success) {
              this.imageList = res.result ? res.result.list : []
              this.total = res.result ? res.result.total : 0
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch(err => {

          })
      },
      //编辑
      editGrade(row){
        this.title = '编辑';
        this.id = row.prayerId;
        this.addFlag = true;
        this.$nextTick(() => {
          this.form.setFieldsValue({title: row.prayerTitle,content: row.prayerContent})
        })
      },
      //删除
      delImage(id){
        let params = {
          imageId: id,
        }
        this.$Utils
          .commonAjax({
            url: api.interfaceConfig.deleteImage,
            type: 'POST',
            data: params,
            flag: true
          }).then(res => {
            if (res.success) {
              this.selectPagination(1);
            } else {
              this.$message.warning(res.errorMessage)
            }
          })
          .catch(err => {

          })
      },
      //新增提交
      handleSubmit (e) {
        e.preventDefault()
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            console.log(err)
            return
          }else{
            let params = {
              prayerTitle: fieldsValue['title'],
              prayerContent: fieldsValue['content'],
            }
            let url = api.interfaceConfig.addPray;
            if(this.title == '编辑'){
              params.prayerId = this.id
              url = api.interfaceConfig.updatePray
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
                  this.selectPagination(1);

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
      this.queryPray()
    }
  }
</script>

<style lang="less" scoped>
  .userMgt{
    .image{
      width: 100px;
      height: 100px;
    }
    .item-title {
      margin-bottom: 40px;
    }
    .classTree{
      min-height: 610px;
      border: 1px solid #F0F2F5;
      overflow-x: scroll;
    }
    .actionbtn{
      display: inline-block;
      width: 42px;
    }
    .br{
      border-right: 1px solid #eeeeee;
      padding-right: 5px;
    }
    .red{
      color: #F0655C;
    }
  }


</style>

