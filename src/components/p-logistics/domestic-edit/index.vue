<template>
  <div class="">
    <h2 class="edit-h2" v-if="!typeAdd">11</h2>
    <h2 class="edit-h2" v-else>22</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {}
    }
  },
  created() {
    this.getItem()
  },
  methods: {
    getItem() {

    }
  }
}
</script>

<style>

</style>
