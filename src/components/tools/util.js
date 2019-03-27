function isNum(str) {
  return /^\d+\.{0,1}\d*$/.test(str)
}

function isNumAll(str) {
  return /^-{0,1}\d+\.{0,1}\d*$/.test(str)
}

function isInteger(str) {
  return /^\d+$/.test(str)
}

function getCookie() {
  let cookie = document.cookie.replace(/ /g, '')
  let arr = cookie.split(';')
  let obj = {}
  arr.forEach((v, i) => {
    let arrV = v.split('=')
    obj[arrV[0]] = decodeURIComponent(arrV[1])
  })
  return obj
}

function verifyProduct(item, type = 1) {
  // type 1: 计算 2：商品信息、查询
  let sku = item.sku
  if (type === 2 && !sku) {
    return 'SKU不能为空'
  }

  let rate = item.profit_rate
  if (!rate) {
    return '预设利润率不能为空'
  }
  if (rate && !isNumAll(rate)) {
    return '预设利润率必须为数字'
  }

  let sellingPrice = item.selling_price
  if (type === 1 && !sellingPrice) {
    return '外币售价不能为空'
  }
  if (type === 1 && !isNum(sellingPrice)) {
    return '外币售价必须为数字'
  }

  let purchasePrice = item.purchase_price
  if (!purchasePrice) {
    return '采购价不能为空'
  }
  if (!isNum(purchasePrice)) {
    return '采购价必须为数字'
  }

  let weight = item.weight
  if (!weight) {
    return '重量不能为空'
  }
  if (!isNum(weight)) {
    return '重量必须为数字'
  }

  let bulk = item.bulk
  if (bulk && !isNum(bulk)) {
    return '体积必须为数字'
  }

  let category = item.category
  if (category !== '1' && category !== '2' && category !== '3' && category !== '4') {
    return '商品种类必须为普通、带电、带磁或超尺寸'
  }

  let local = item.local
  if (type === 1 && local !== '1' && local !== '2') {
    return '当地配送必须为Ebay或Amazon'
  }

  return ''
}

export default {
  isNumAll,
  isNum,
  isInteger,
  getCookie,
  verifyProduct
}
