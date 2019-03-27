<template>
  <div class="domestic-normal">
    <!-- 1: normal 2: electric 3: magnetism 4: oversize -->
    <logistics 
      uploadApiInKey="dInOversize" 
      dowloadUrl="/binheng/api/domestic/download?type=4" 
      uploadName="超尺寸"
      apiKey="domestic"
      type="4"
    >
    </logistics>
  </div>
</template>

<script>
import logistics from './components/logistics'

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
