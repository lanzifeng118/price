<template>
  <div class="logistics">
    <tab :items="tabItems"></tab>
    <div class="logistics-btns">
      <button class="button grey">导入表格</button>
      <button class="button yellow">导出表格</button>
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
        { text: '国内小包', href: '/admin/logistics/', icon: 'search_list' },
        { text: '空运小包', href: '/admin/logistics/classify', icon: 'evaluate' },
        { text: '海运小包', href: '/admin/logistics/banner', icon: 'pic' }
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
