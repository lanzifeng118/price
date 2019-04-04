<template>
  <td>
    <div v-if="item.type === 1">
      {{item[config.name]}}
    </div>
    <div v-else>
      <input
        v-if="config.type === 'number'"
        type="text"
        @change="change"
        v-model.trim.lazy.number="item[config.name]"
      >
      <input
        v-else
        type="text"
        @change="change"
        v-model.trim.lazy="item[config.name]"
      >
    </div>
  </td>
</template>
<script>
export default {
  props: {
    item: Object,
    config: Object
  },
  methods: {
    change() {
      if (this.config.onChange) {
        this.$emit('change', { item: this.item, name: this.config.name })
      }
    }
  }
}
</script>

