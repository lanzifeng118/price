import logistics from 'components/logistics'

export default {
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