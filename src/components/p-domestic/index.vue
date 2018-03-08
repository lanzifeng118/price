<template>
  <div class="logistics">
    <tab :items="tabItems"></tab>
    <div class="logistics-btns">
      <button class="button grey"><span class="icon icon-excel"></span>导入</button>
      <button class="button yellow"><span class="icon icon-excel"></span>导出</button>
    </div>
    <div class="logistics-view">
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
        { text: '普通', href: '/admin/domestic/', icon: 'bag' },
        { text: '带电', href: '/admin/domestic/electric', icon: 'electric' },
        { text: '带磁', href: '/admin/domestic/magnetism', icon: 'magnetism' },
        { text: '超尺寸', href: '/admin/domestic/oversize', icon: 'box' }
      ]
    }
  },
  components: {
    tab
  }
}
</script>

<style>
.logistics {
  position: relative;
}
.logistics-view {
  padding: 0 30px;
}
.logistics-btns {
  position: absolute;
  right: 30px;
  top: 10px;
}
</style>
