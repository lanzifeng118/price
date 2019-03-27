<template>
  <div class="header">
    <div class="header-wrap f-clearfix">
      <div class="header-info f-left">
        <span>{{title}}</span>
      </div>
      <ul class="header-operate f-right">
        <li class="header-operate-item">
          您好，{{role}}！
        </li>
        <li class="header-operate-item">
          <a href="javascript: void 0" @click="logout"><span class="icon icon-exit"></span>退出登陆</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { API_user } from '../model/user'
  import { mapState } from 'vuex'
  
  export default {
    data() {
      return {}
    },
    computed: mapState({
      title: state => state.title,
      role: state => state.userRole
    }),
    methods: {
      logout() {
        API_user.logout({ username: this.username })
          .then(data => {
            this.$router.push({ path: '/login', query: { redirect: this.$route.path }})
          })
      }
    }
  }
</script>

<style>
  .header {
    height: 50px;
    background-color: #515a6e;
    color: #eaeaea;
  }
  .header-wrap {
    padding: 0 50px;
    margin: 0 auto;
  }
  .header-info {
    font-size: 0
  }
  .header-logo {
    height: 30px;
    margin-top: 10px;
  }
  .header-info span {
    line-height: 50px;
    display: inline-block;
    font-size: 16px;
    vertical-align: top;
  }
  .header-operate-item {
    display: inline-block;
    margin-left: 20px;
    line-height: 50px;
    color: #aaa;
  }
  .header-operate-item a {
    display: inline-block;
    transition: all 0.2s;
    color: #eaeaea;
  }
  .header-operate-item a:hover {
    color: #fff;
  }
</style>
