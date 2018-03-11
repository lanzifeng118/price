<template>
  <div class="local-ebay">
    <!-- 1: ebay 2: amazon  -->
    <logistics 
      uploadApiInKey="lInEbay" 
      dowloadUrl="/binheng/api/local/download?type=1" 
      uploadName="ebay"
      apiKey="local"
      type="1"
    >
    </logistics>
  </div>
</template>

<script>
import logistics from 'components/c-logistics/index'

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
