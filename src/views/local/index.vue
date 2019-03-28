<template>
  <div class="local">
    <tab :items="tabItems"></tab>
    <div class="local-view">
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
        { text: 'Ebay', href: '/local/', icon: 'eee' },
        { text: 'Amazon', href: '/local/amazon', icon: 'amazon' },
        { text: 'Wish', href: '/local/wish', icon: 'evaluate' }
      ]
    }
  },
  components: {
    tab
  }
}
</script>

<style>
.local {
  position: relative;
}
.local-view {
  padding: 0 30px;
}
</style>
