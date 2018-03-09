<template>
  <div class="amazon">
    <!-- 1: normal 2: electric 3: magnetism 4: oversize -->
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
.amazon {
  padding: 50px 30px 20px;
}
.amazon .logistics .upload {
  top: -45px;
}
</style>
