<template>
<div class="toast">
  <div class="toast-box">
    <div class="toast-icon">
      <span :class="'icon-'+icon"></span>
    </div>
    <p class="toast-text">
      {{text}}
    </p>
  </div>
</div>
</template>

<script>
export default {
  props: {
    text: String,
    icon: {
      type: String,
      default: 'warn'
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style>
.toast {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
.toast-box {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: rgba(0,0,0,0.4);
  border-radius: 5px;
  box-shadow: 0 0 15px #ddd;
  width: 350px;
  height: 170px;
  margin-left: -175px;
  margin-top: -180px;
}
.toast-icon {
  padding-top: 25px;
  text-align: center;
  font-size: 68px;
  color: #fff;
}
.toast-text {
  margin-top: 8px;
  font-size: 16px;
  text-align: center;
  color: #fff;
}
</style>
