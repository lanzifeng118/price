<template>
  <div class="config">
    <tab :items="tabItems"></tab>
    <div class="config-view">
      <router-view ></router-view>
    </div>
  </div>
</template>

<script>
import tab from 'components/c-tab/index'
export default {
  data() {
    return {
      tabItems: [
        { text: '用户列表', href: '/admin/config/', icon: 'user' },
        { text: '修改密码', href: '/admin/config/password', icon: 'edit_circle' }
      ]
    }
  },
  components: {
    tab
  }
}
</script>

<style>
.config {
  position: relative;
}
.config-view {
  padding: 0 30px;
}
</style>
