<template>
  <div class="domestic-category">
    <!-- 1: normal 2: electric 3: magnetism 4: oversize -->
    <logistics 
      from="domestic"
      :localType="localType"
      :type="type"
    >
    </logistics>
  </div>
</template>

<script>
import logistics from 'components/logistics'

export default {
  props: {
    type: {
      type: String,
      value: '1'
    }
  },
  computed: {
    localType() {
      let _type = '1'
      switch (this.$route.params.local) {
        case 'amazon':
          _type = '2'
          break
        case 'wish':
          _type = '3'
          break
      }
      return _type
    }
  },
  components: {
    logistics
  }
}
</script>

<style>

</style>
