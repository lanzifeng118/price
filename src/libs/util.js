export function turnObj(arr) {
  let map = {}
  arr.forEach(v => {
    map[v.type] = v.name
  })
  return map
}

export function getCookie() {
  let cookie = document.cookie.replace(/ /g, '')
  let arr = cookie.split(';')
  let obj = {}
  arr.forEach((v, i) => {
    let arrV = v.split('=')
    obj[arrV[0]] = decodeURIComponent(arrV[1])
  })
  return obj
}

export function isNum(str) {
  return /^\d+\.{0,1}\d*$/.test(str)
}

export function isNumAll(str) {
  return /^-{0,1}\d+\.{0,1}\d*$/.test(str)
}

export function isInteger(str) {
  return /^\d+$/.test(str)
}

export function getWinWidth() {
  let winWidth = 0
  if (window.innerWidth) {
    winWidth = window.innerWidth
  } else if (document.body && document.body.clientWidth) {
    winWidth = document.body.clientWidth
  }
  // 通过深入Document内部对body进行检测，获取窗口大小
  if (document.documentElement && document.documentElement.clientWidth) {
    winWidth = document.documentElement.clientWidth
  }
  return winWidth
}

export function getWinHeigth() {
  let winHeigth = 0
  // 获取窗口高度
  if (window.innerHeight) {
    winHeigth = window.innerHeight
  } else if (document.body && document.body.clientHeight) {
    winHeigth = document.body.clientHeight
  }
  // 通过深入Document内部对body进行检测，获取窗口大小
  if (document.documentElement && document.documentElement.clientHeight) {
    winHeigth = document.documentElement.clientHeight
  }
  return winHeigth
}