<template>
  <div class="domestic-normal">
    <!-- 1: normal 2: electric 3: magnetism 4: oversize -->
    <logistics 
      uploadApiKey="inNormal" 
      uploadName="带磁"
      apiKey="domestic"
      type="3"
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
