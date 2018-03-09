<template>
  <div class="domestic-normal">
    <!-- 1: normal 2: electric 3: magnetism 4: oversize -->
    <logistics 
      uploadApiKey="inNormal" 
      uploadName="普通"
      apiKey="domestic"
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
