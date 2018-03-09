<template>
  <div class="amazon">
    <!-- 1: ebay 2: amazon  -->
    <logistics 
      uploadApiKey="inNormal" 
      uploadName="amazon"
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
