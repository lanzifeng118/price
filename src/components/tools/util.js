function isNum(str) {
  return /^\d+\.{0,1}\d*$/.test(str)
}
function isInteger(str) {
  return /^\d+$/.test(str)
}

let toast = {
  show(obj, text, icon) {
    if (!icon) {
      icon = 'warn'
    }
    obj.text = text
    obj.icon = icon
    obj.show = true
  },
  hide(obj) {
    setTimeout(() => {
      obj.show = false
    }, 800)
  },
  fade(obj, text, icon) {
    this.show(obj, text, icon)
    this.hide(obj)
  }
}

let req = {
  queryError(obj) {
    toast.fade(obj, '获取信息失败，请稍后再试')
  },
  changeError(obj) {
    toast.fade(obj, '出错了，请稍后再试!', 'sad')
  }
}

function getCookie() {
  let cookie = document.cookie.replace(/ /g, '')
  let arr = cookie.split(';')
  let obj = {}
  arr.forEach((v, i) => {
    let arrV = v.split('=')
    obj[arrV[0]] = arrV[1]
  })
  return obj
}

export default {
  isNum,
  isInteger,
  toast,
  req,
  getCookie
}
