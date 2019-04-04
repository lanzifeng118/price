<template>
  <div class="domestic-normal">
    <!-- 1: normal 2: electric 3: magnetism 4: oversize -->
    <logistics 
      uploadApiInKey="dInElectric" 
      dowloadUrl="/binheng/api/domestic/download?type=2"
      uploadName="带电"
      apiKey="domestic"
      :localType="localType"
      type="2"
    >
    </logistics>
  </div>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [mixins]
}
</script>

<style>

</style>
