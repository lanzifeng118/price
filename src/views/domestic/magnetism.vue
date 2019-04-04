<template>
  <div class="domestic-normal">
    <!-- 1: normal 2: electric 3: magnetism 4: oversize -->
    <logistics 
      uploadApiInKey="dInMagnetism" 
      dowloadUrl="/binheng/api/domestic/download?type=3" 
      uploadName="带磁"
      apiKey="domestic"
      :localType="localType"
      type="3"
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
