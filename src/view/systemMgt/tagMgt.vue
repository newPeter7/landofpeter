<template>
  <a-layout class="userMgt">
    <a-layout-content :style="{ margin: '24px 16px', padding: '24px',background: '#fff', minHeight: '540px' }">
      <div>
        <a-button style="margin-bottom: 24px" type="primary" @click="addPray">+新增</a-button>
        <a-table :columns="columns" :dataSource="tagList" rowKey="tagId">
                <span slot="action" slot-scope="text, record">
                  <a href="javascript:void(0)" class="actionbtn br" @click="editGrade(record)">编辑</a>
                  <a-popconfirm title="确定删除该条信息？" okText="确定" cancelText="取消" @confirm="deleteTag(record.tagId)">
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
        tagList: [],
        columns: [
          {
            title: '标签名称',
            dataIndex: 'tagName',
            align: 'center',
            width: 400
          },
          {
            title: '标记',
            dataIndex: 'enabled',
            align: 'center'
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
      queryTags(){
        this.$Utils
          .commonAjax({
            url: api.interfaceConfig.tagList,
            type: 'POST',
            flag: true
          }).then(res => {
            if (res.success) {
              this.tagList = res.result || []
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
        this.id = row.tagId;
        this.addFlag = true;
        this.$nextTick(() => {
          this.form.setFieldsValue({tagName: row.tagName})
        })
      },
      //删除
      deleteTag(id){
        let params = {
          tagId: id,
        }
        this.$Utils
          .commonAjax({
            url: api.interfaceConfig.deleteTag,
            type: 'POST',
            data: params,
            flag: true
          }).then(res => {
            if (res.success) {
              this.queryTags();
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
              params.tagId = this.id
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
                  this.queryTags();

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
      this.queryTags()
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

