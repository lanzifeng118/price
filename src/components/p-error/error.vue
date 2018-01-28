<template>
  <div class="error">
    <div class="error-box">
      <div class="error-box-title">
        <h2>SORRY</h2>
        <h2>AN ERROR HAS OCCURED!</h2>
        <h1>对不起，出错啦！</h1>
        <p>很抱歉，现在暂时无法处理您的访问请求！</p>
      </div>
      <div class="error-back" @click="back">
        <span class="icon icon-back"></span>返回首页
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      back() {
        this.$router.push('/admin/home')
      }
    }
  }

</script>

<style>
.error {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background: #cdf5ff url(../../common/images/login-bg.png) no-repeat center bottom ;
}
.error-box {
  position: absolute;
  width: 500px;
  margin-left: -200px;
  margin-top: -250px;
  top: 50%;
  left: 50%;
}
.error-box-big-icon {
  font-size: 60px;
}
.error-box-title {
  border-left: 10px solid #48b3d5;
  padding-left: 20px;
}
.error-box h2 {
  margin-bottom: 5px;
  font-size: 28px;
}
.error-box h1 {
  font-weight: bold;
  font-size: 58px;
  margin-top: 10px;
}
.error-box p {
  color: #48b3d5;
  font-size: 16px;
  margin-top: 20px;
}
.error-back {
  padding-left: 30px;
  color: #e29800;
  font-size: 20px;
  margin-top: 45px;
  cursor: pointer;
}
.error-back span {
  font-size: 14px;
}
</style>
