import vue from 'vue'
import toastComponent from './toast.vue'

const ToastConstructor = vue.extend(toastComponent)

function showToast({ text, icon = 'warn', duration = 1000}) { 

  const all = document.querySelectorAll('.toast')
  for (let index = 0; index < all.length; index++) {
    const item = all[index]
    document.body.removeChild(item)
  }

  const toastDom = new ToastConstructor({
    el: document.createElement('div'),
    data() {
      return {
        text,
        icon,
        show: true
      }
    }
  })
  const { $el } = toastDom

  document.body.appendChild($el) 
  
  setTimeout(() => { toastDom.show = false }, duration)
  setTimeout(() => {
    if (document.body.contains($el)) {
      document.body.removeChild($el)
    }
  }, duration + 200)
}

function registryToast() {  
  vue.prototype.$toast = {
    warn(text, duration) {
      showToast({ text, icon: 'warn', duration })
    },
    error(text = '出错了，请稍后再试', duration) {
      showToast({ text, icon: 'sad', duration })
    },
    success(text, duration) {
      showToast({ text, icon: 'check', duration })
    },
    upload(text, duration) {
      showToast({ text, icon: 'upload', duration })
    },
    info(text, duration) {
      showToast({ text, icon: 'evaluate', duration })
    },
    config: showToast
  }
}

export default registryToast

// this.$toast.success()
// this.$toast.error()
// this.$toast.warn()
