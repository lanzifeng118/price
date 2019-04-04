<template>
  <div class="domestic-normal">
    <!-- 1: normal 2: electric 3: magnetism 4: oversize -->
    <logistics 
      uploadApiInKey="dInNormal" 
      dowloadUrl="/binheng/api/domestic/download?type=1" 
      uploadName="普通"
      apiKey="domestic"
      :localType="localType"
      type="1"
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
