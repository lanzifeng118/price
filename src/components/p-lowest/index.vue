<template>
  <div class="lowest">
    <tab :items="tabItems"></tab>
    <div class="lowest-view">
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
        { text: '10%利润率', href: '/admin/lowest/', icon: 'eee' },
        { text: '15%利润率', href: '/admin/lowest/ebay-15', icon: 'eee' },
        { text: '10%利润率', href: '/admin/lowest/amazon-10', icon: 'amazon' },
        { text: '15%利润率', href: '/admin/lowest/amazon-15', icon: 'amazon' }
      ]
    }
  },
  components: {
    tab
  }
}
</script>

<style>
.lowest {
  position: relative;
}
.lowest-view {
  padding: 0 30px;
}
</style>
