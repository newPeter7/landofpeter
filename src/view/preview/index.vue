<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider
            :trigger="null"
            collapsible
            v-model="collapsed"
            width="256px"
    >
      <div class="logo">管理平台</div>
      <a-menu theme="dark" mode="inline" :default-open-keys="['sub1']" :selectedKeys="[$route.path]">
        <template>
          <a-sub-menu key="sub1">
            <span slot="title"><a-icon type="setting" />系统管理</span>
            <a-menu-item>
              <a-icon type="pie-chart"/>
              <router-link to="/article">文章管理</router-link>
            </a-menu-item>
            <a-menu-item>
              <a-icon type="pie-chart"/>
              <router-link to="/paryMgt">发布管理</router-link>
            </a-menu-item>
            <a-menu-item>
              <a-icon type="pie-chart"/>
              <router-link to="/tagMgt">标签管理</router-link>
            </a-menu-item>
            <a-menu-item>
              <a-icon type="pie-chart"/>
              <router-link to="/zoneMgt">羊圈管理</router-link>
            </a-menu-item>
            <a-menu-item>
              <a-icon type="pie-chart"/>
              <router-link to="/imageMgt">图片管理</router-link>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 15px">
        <div style="display: flex;justify-content: space-between">
          <div style="line-height: 64px">
            <a-icon
                    class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="()=> collapsed = !collapsed"
            />
          </div>
          <div>
            <div style="display: flex;justify-content: flex-end">
              <div style="width: 140px;line-height: 64px">
                <a-icon type="user"/>
                <a-dropdown>
                  <a class="ant-dropdown-link" href="#"> {{this.userInfo ? this.userInfo.phone : ''}}
                    <a-icon type="down"/>
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a href="javascript:;" @click="logOut">退出登录</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            </div>
          </div>
        </div>
      </a-layout-header>
        <router-view></router-view>
    </a-layout>
  </a-layout>
</template>

<script>
import api from '../../api/interface';

export default {
  data () {
    return {
      collapsed: false,
      menuList: [],
      userInfo: {},
      db: 123
    }
  },
  methods: {
    //退出登录
    logOut(){
      this.$router.push({path:'login'})
      window.localStorage.removeItem('userInfo');
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('roleId');
    },
    //获取菜单
    queryMenuList(){
      let params = {
        userId: this.userInfo ? this.userInfo.id : '',
        unitId: this.userInfo ? this.userInfo.unitId : '',
        systemid: 0
      }
      this.$Utils
        .commonAjax({
          url: api.interfaceConfig.findUserMenu,
          type: 'POST',
          data: params
        }).then(res => {
          if (res.status === 200) {
            this.menuList = res.data;

          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch(err => {

        })
    }
  },
  mounted () {
    this.$store.commit('sss',this.db)
    console.log(this.$store.state.msg)
    try{
      // this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      // this.queryMenuList()
    } catch (e) {

    }
  }
}
</script>

<style lang="less" scoped>
  .item-title{
    margin-bottom: 40px;
  }
  .clearfix{
    clear: both;
    min-width: 300px;
  }
  .ant-dropdown-link{
    color: rgba(0, 0, 0, 0.85);
  }

</style>
<style>
  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    /*line-height: 64px;*/
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }

  #components-layout-demo-custom-trigger .logo {
    height: 32px;
    color: white;
    font-size: 24px;
    /*background: url("../../assets/mini-logo.png") no-repeat;*/
    margin: 16px 16px 16px 25px;
  }
  #components-form-demo-validate-other .dropbox {
    height: 180px;
    line-height: 1.5;
  }
  .ant-select-selection-selected-value{
    line-height: 30px;
  }
  .ant-menu-item a{
    display: inline-block !important;
  }
  .ant-layout-sider{
    min-height: 950px;
  }
  .ant-layout{
    min-width: 550px !important;
    overflow-x: hidden;
  }

</style>
