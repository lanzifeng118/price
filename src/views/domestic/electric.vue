<template>
  <div class="domestic-normal">
    <!-- 1: normal 2: electric 3: magnetism 4: oversize -->
    <logistics 
      uploadApiInKey="dInElectric" 
      dowloadUrl="/binheng/api/domestic/download?type=2"
      uploadName="带电"
      apiKey="domestic"
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
  created() {
    console.log('local', this.$route.params.local)
  },
  methods: {},
  components: {
    logistics
  }
}
</script>

<style>

</style>
