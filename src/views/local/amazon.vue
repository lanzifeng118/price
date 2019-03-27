<template>
  <div class="local-amazon">
    <!-- 1: ebay 2: amazon  -->
    <logistics 
      uploadApiInKey="lInAmazon" 
      dowloadUrl="/binheng/api/local/download?type=2" 
      uploadName="Amazon"
      apiKey="local"
      type="2"
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
