<template>
<div class="pop">
  <div class="pop-box">
    <div class="pop-icon" :class="'pop-icon-' + type">
      <span v-if="type == 'warning'" class="icon-warn"></span>
      <span v-if="type == 'error'" class="icon-close"></span>
    </div>
    <h2 class="pop-text">
      {{text}}
    </h2>
    <div v-if="type == 'warning'" class="pop-close" @click="close">
      <span class="icon-round_close"></span>
    </div>
    <div class="pop-button" :class="'pop-button-' + type">
      <button class="button" type="button" @click="confirm">确定</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['text', 'type'],
  data() {
    return {
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    close() {
      this.$emit('close')
    }
  }

}
</script>

<style>
.pop {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}
.pop-box {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 15px #aaa;
  width: 350px;
  height: 220px;
  margin-left: -175px;
  margin-top: -180px;
}
.pop-icon {
  padding-top: 25px;
  text-align: center;
  font-size: 68px;
}
.pop-icon-warning {
  color: #e29800;
}
.pop-icon-error {
  color: #d24900;
}
.pop-text {
  margin-top: 8px;
  font-size: 16px;
  text-align: center;
}
.pop-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 22px;
  cursor: pointer;
  transition: color 0.2s;
}
.pop-close:hover {
  color: #00d0bc;
}
.pop-button {
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
.pop-button button {
  width: 120px;
}
.pop-button-warning button:hover {
  background-color: #e29800;
  border-color: #e29800;
}
.pop-button-error button:hover {
  border-color: #d24900;
  background-color: #d24900;
}
</style>
