function getWinWidth(params) {
  let winWidth = 0
  if (window.innerWidth) {
    winWidth = window.innerWidth
  } else if ((document.body) && (document.body.clientWidth)) {
    winWidth = document.body.clientWidth
  }
  // 通过深入Document内部对body进行检测，获取窗口大小
  if (document.documentElement && document.documentElement.clientWidth) {
    winWidth = document.documentElement.clientWidth
  }
  return winWidth
}

function getWinHeigth(params) {
  let winHeigth = 0
  // 获取窗口高度
  if (window.innerHeight) {
    winHeigth = window.innerHeight
  } else if ((document.body) && (document.body.clientHeight)) {
    winHeigth = document.body.clientHeight
  }
  // 通过深入Document内部对body进行检测，获取窗口大小
  if (document.documentElement && document.documentElement.clientHeight) {
    winHeigth = document.documentElement.clientHeight
  }
  return winHeigth
}

export default {
  getWinWidth,
  getWinHeigth
}
