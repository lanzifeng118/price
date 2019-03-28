import { isNumAll, isNum } from './util'
import { categoryMap, localMap  } from '../store'

function verifyProduct(item, type = 1) {
  // type 1: 计算 2：商品信息、查询

  const { sku } = item
  if (type === 2 && !sku) {
    return 'SKU不能为空'
  }

  const { profit_rate: rate } = item
  if (!rate) {
    return '预设利润率不能为空'
  }
  if (rate && !isNumAll(rate)) {
    return '预设利润率必须为数字'
  }

  const { selling_price: sellingPrice } = item
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

  const { weight } = item
  if (!weight) {
    return '重量不能为空'
  }
  if (!isNum(weight)) {
    return '重量必须为数字'
  }

  const { bulk } = item
  if (bulk && !isNum(bulk)) {
    return '体积必须为数字'
  }

  const { category } = item
  if (!categoryMap[category]) {
    return '商品种类有误'
  }

  const { local } = item
  if (type === 1 && !localMap[local]) {
    return '当地配有误'
  }

  return ''
}

export default verifyProduct
