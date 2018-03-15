<template>
  <div class="operate">
    <div v-if="!status || status === 1">
      <a href="javascript: void 0" @click="editItem">
        <span class="icon icon-edit_circle"></span>修改</a>
      <a v-if="!editOnly" href="javascript: void 0" @click="deleteItem">
        <span class="icon icon-delete_circle"></span>删除</a>
    </div>
    <div v-else-if="status === 2" class="operate-edit">
      <a href="javascript: void 0" @click="submitEdit">
        <span class="icon icon-round_check"></span>提交
      </a>
      <a href="javascript: void 0" @click="cancelEdit">
        <span class="icon icon-round_close"></span>取消
      </a>
    </div>
    <div v-else class="operate-add">
      <a href="javascript: void 0" @click="submitAdd">
        <span class="icon icon-round_check"></span>提交
      </a>
      <a href="javascript: void 0" @click="cancelAdd">
        <span class="icon icon-round_close"></span>取消
      </a>
    </div>
  </div>
</template>
<script>
export default {
  props: ['status', 'editOnly'],
  data() {
    return {}
  },
  methods: {
    editItem() {
      this.$emit('editItem')
    },
    deleteItem() {
      this.$emit('deleteItem')
    },
    submitEdit() {
      this.$emit('submitEdit')
    },
    cancelEdit() {
      this.$emit('cancelEdit')
    },
    submitAdd() {
      this.$emit('submitAdd')
    },
    cancelAdd() {
      this.$emit('cancelAdd')
    }
  },
  components: {
  }
}
</script>
<style>
.operate a {
  display: inline-block;
  vertical-align: middle;
  line-height: 18px;
}
.operate a:first-child {
  margin-right: 10px;
}
.operate .icon {
  color: #00d0bc;
  vertical-align: -3px;
  font-size: 18px;
}

.operate-add .icon {
  color: #f0a807;
}
/* add */
.operate-add a:hover .icon {
  color: #ffba1f;
}
.operate-add a:hover {
  color: #ffba1f;
}
/* edit */
.operate-edit .icon {
  color: #d24900;
}
.operate-edit a:hover .icon {
  color: #e95303;
}
.operate-edit a:hover {
  color: #e95303;
}

</style>
