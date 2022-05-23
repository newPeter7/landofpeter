<template>
  <a-layout class="userMgt">
    <a-layout-content :style="{ margin: '24px 16px', padding: '24px',background: '#fff', minHeight: '540px' }">
      <div>
        <a-button style="margin-bottom: 24px" type="primary" @click="addPray">+新增</a-button>
        <a-table :columns="columns" :dataSource="zoneList" rowKey="zoneId">
          <span slot="user" slot-scope="text, record">
            <span>{{text.user.nickname}}</span>
            <img :src="text.user.avatar.imageUrl" alt="" style="width: 50px;height: 50px;border-radius: 5px">
          </span>
          <span slot="image" slot-scope="text, record">
            <img v-if="text.images[0].imageUrl" :src="text.images[0].imageUrl" alt="" style="width: 100px;height: 100px;border-radius: 5px">
          </span>
          <span slot="action" slot-scope="text, record">
            <a-popconfirm title="确定删除该条信息？" okText="确定" cancelText="取消" @confirm="deleteZone(record.zoneId)">
              <a href="javascript:void(0)" class="actionbtn red">删除</a>
            </a-popconfirm>
          </span>
        </a-table>
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
        <a-form-item label="标签名称"
                     :label-col="formItemLayout.newLabelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input placeholder="请输入标签名称" :maxLength="6" v-decorator="['tagName',{rules: [{ required: true, message: '请输入标题!' }]}]"></a-input>
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
        addFlag: false,
        title: '新增',
        zoneList: [],
        pageSize: 15,
        pageNum: 1,
        total: 0,
        columns: [
          {
            title: '用户',
            align: 'center',
            scopedSlots: { customRender: 'user' },
            width: 300
          },
          {
            title: '图片',
            align: 'center',
            scopedSlots: { customRender: 'image' },
            width: 300
          },
          {
            title: '内容',
            dataIndex: 'zoneContent',
            align: 'center',
            width: 400
          },
          {
            title: '时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 200
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
          this.form.setFieldsValue({tagName: ''})
        })
      },
      //查询
      queryZone(){
        let params = {
          openid: 'admin',
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
        this.$Utils
          .commonAjax({
            url: api.interfaceConfig.zoneList,
            type: 'POST',
            data: params,
            flag: true
          }).then(res => {
            if (res.success) {
              this.zoneList = res.result ? res.result.list : []
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
        this.id = row.zoneId;
        this.addFlag = true;
        this.$nextTick(() => {
          this.form.setFieldsValue({tagName: row.tagName})
        })
      },
      //删除
      deleteZone(id){
        let params = {
          zoneId: id,
        }
        this.$Utils
          .commonAjax({
            url: api.interfaceConfig.deleteZone,
            type: 'POST',
            data: params,
            flag: true
          }).then(res => {
            if (res.success) {
              this.queryZone();
            } else {
              this.$message.warning(res.msg)
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
              tagName: fieldsValue['tagName']
            }
            let url = api.interfaceConfig.addTag;
            if(this.title == '编辑'){
              params.zoneId = this.id
              url = api.interfaceConfig.updateTag
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
                  this.queryZone();

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
      this.queryZone()
    }
  }
</script>

<style lang="less" scoped>
  .userMgt{
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

