<template>
  <div class="local-ebay">
    <!-- 1: ebay 2: amazon  -->
    <logistics 
      from="local"
      type="1"
    >
    </logistics>
  </div>
</template>

<script>
import logistics from 'components/logistics'

export default {
  data() {
    return {}
  },
  created() {},
  methods: {},
  components: {
    logistics
  }
}
</script>

<style>
</style>
