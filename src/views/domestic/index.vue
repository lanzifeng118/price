<template>
  <div class="domestic">
    <tab :items="tabItems"></tab>
    <div class="domestic-view">
      <router-view ></router-view>
    </div>
  </div>
</template>

<script>
import tab from 'components/c-tab/index'
export default {
  data() {
    return {
      // tabItems: [
      //   { text: '普通', href: '/domestic/', icon: 'bag' },
      //   { text: '带电', href: '/domestic/electric', icon: 'electric' },
      //   { text: '带磁', href: '/domestic/magnetism', icon: 'magnetism' },
      //   { text: '超尺寸', href: '/domestic/oversize', icon: 'box' }
      // ]
    }
  },
  computed: {
    tabItems() {
      const { local } = this.$route.params
      return [
        { text: '普通', href: `/domestic/${local}/`, icon: 'bag' },
        { text: '带电', href: `/domestic/${local}/electric`, icon: 'electric' },
        { text: '带磁', href: `/domestic/${local}/magnetism`, icon: 'magnetism' },
        { text: '超尺寸', href: `/domestic/${local}/oversize`, icon: 'box' }
      ]
    }
  },
  created() {
    // console.log('local', this.$route.params.local)
  },
  components: {
    tab
  }
}
</script>

<style>
.domestic {
  position: relative;
}
.domestic-view {
  padding: 0 30px;
}
</style>
