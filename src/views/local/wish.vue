<template>
  <div class="local-ebay">
    <!-- 1: ebay 2: amazon 3: wish  -->
    <logistics 
      from="local"
      type="3"
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
