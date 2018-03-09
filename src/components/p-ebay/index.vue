<template>
  <div class="ebay">
    <!-- 1: normal 2: electric 3: magnetism 4: oversize -->
    <logistics 
      uploadApiKey="inNormal" 
      uploadName="ebay"
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
.ebay {
  padding: 50px 30px 20px;
}
.ebay .logistics .upload {
  top: -45px;
}
</style>
