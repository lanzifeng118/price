<template>
  <div class="local-ebay">
    <!-- 1: ebay 2: amazon 3: wish  -->
    <logistics 
      uploadApiInKey="lInEbay" 
      dowloadUrl="/binheng/api/local/download?type=3" 
      uploadName="wish"
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
