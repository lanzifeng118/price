<template>
  <div class="header">
    <div class="header-wrap f-clearfix">
      <div class="header-info f-left">
        <img :src="logoSrc" class="header-logo" alt="">
        <span>广州缤恒定价查询系统</span>
      </div>
      <ul class="header-operate f-right">
        <li class="header-operate-item">
          您好，{{userName}}！
        </li>
        <li class="header-operate-item">
          <a href="javascrip: void 0" @click="logout"><span class="icon icon-exit"></span>退出登陆</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import logoSrc from 'src/common/images/logo.png'
  export default {
    data() {
      return {
        logoSrc
      }
    },
    computed: {
      userName() {
        return this.$store.state.user
      }
    },
    methods: {
      logout() {
        this.axios({
          method: 'post',
          url: '/price/logout',
          data: {
            username: this.userName
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.$router.push({path: '/login', query: { redirect: this.$route.path }})
          }
        })
      }
    }
  }
</script>

<style>
  .header {
    height: 50px;
    background-color: #363f46;
    color: #fff;
  }
  .header-wrap {
    width: 92%;
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
    margin-left: 15px;
    display: inline-block;
    font-size: 14px;
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
    color: #fff;
  }
  .header-operate-item a:hover {
    color: #07efd9;
  }
</style>
