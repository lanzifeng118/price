const DIGITS = 2
let logOrder = ['国内小包', '海运小包', '空运小包']

/**
 * data: 组合好返回给前端的数据,属性有：
 *    product: total,list 下载时，list包含所有数据
 *    zone: 地区信息
 *    factor: 因子
 *    local: 当地配送物流
 *    domestic_1: 普通
 *    domestic_2: 带电
 *    domestic_3: 带磁
 *    domestic_4: 超尺寸
 * profitRate: 利润率，前端传入
 * backend: 是否后端使用，默认是，返回数据不太一样，后端返回一个二维数组
 */

function lowest(data, profitRate, backend = true) {
  // console.log(data)
  // console.log(profitRate)
  let product = data.product
  let zone = data.zone
  let factor = data.factor
  let local = data.local

  let items = []
  let titles = ['SKU']
  zone.forEach(v => {
    logOrder.forEach(vL => {
      titles.push(v.name + '-' + vL.slice(0, 2))
    })
  })
  product.list.forEach(v => {
    let arr = [v.sku]
    let domestic = data[`domestic_${v.category}`]
    arr = arr.concat(cal(v, zone, factor, domestic, local, profitRate))
    items.push(arr)
  })
  return backend ? [titles].concat(items) : { titles, items }
}

/**
 * logFirst 头程成本
 * logSecond 二程成本(当地货币)
 * logSecondRmb 二程成本(人民币）
 * costSell 销售成本 = 售价 * 汇率 * 因子
 * cost 总成本 = 采购成本 + 物流成本 + 销售成本
 * profit 毛利润 = 销售价格 - 总成本
 * profitRate 利润率 = 毛利润 / 销售价格
 * 售价 =（采购成本+物流成本）/汇率/(1 - 0.18 - 0.1)
 */

/**
 * product 商品信息
 * zone 地区信息
 * factor 公式系数
 * domestic 国内小包
 * local 当地配送
 * profitRate 商品预设利润率
 */
function cal(product, zone, factor, domestic, local, profitRate, sellPriceOnly = true) {
  // 计算重量
  let pWeight = product.weight
  let pBule = product.bulk
  let weight = calWeight(pWeight, pBule, factor.weight_1)
  let weightLocal = calWeight(pWeight, pBule, factor.weight_2)

  let items = []
  zone.forEach(v => {
    v.list = []
    let zoneLow = v.name.toLowerCase()
    let exRate = parseFloat(v.exchange_rate)
    let pPrice = parseFloat(product.purchase_price)
    let sPrice = parseFloat(product.selling_price)
    let priceSea = parseFloat(v.price_sea)
    let priceAir = parseFloat(v.price_air)
    let priceAirEm = parseFloat(v.price_air_em)
    let currencySymbol = v.currency_symbol

    logOrder.forEach((vL, iL) => {
      let item = {}
      item.logType = vL
      if (iL === 0) {
        // 国内小包
        console.log(domestic[zoneLow])
        item.logFirst = calLog(weight, domestic[zoneLow])
        item.logSecond = 0
      } else {
        if (iL === 1) {
          // 海运小包
          item.logFirst = priceSea * weight
        } else if (iL === 2) {
          // 空运小包
          let category = product.category
          if (category === '2' || category === '3') {
            // 带电带磁
            item.logFirst = priceAirEm * weight
          } else {
            item.logFirst = priceAir * weight
          }
        }
        item.logSecond = calLog(weightLocal, local[zoneLow])
      }
      let factorSC = factor.sell_cost
      // 采购成本
      item.pPrice = pPrice
      // 二程成本(人民币）
      item.logSecondRmb = item.logSecond * exRate
      // 预设利润售价
      item.pRate_defalut = calProfitRate(profitRate / 100)

      if (!sellPriceOnly) {
        // 售价
        item.sPrice = sPrice
        // 售价 人民币
        item.sPriceRmb = sPrice * exRate
        // 销售成本
        item.costSell = item.sPriceRmb * factorSC
        // 总成本
        item.cost = pPrice + item.costSell + item.logFirst + item.logSecondRmb
        // 毛利润
        item.profit = item.sPriceRmb - item.cost
        // 是否盈利
        item.earn = item.profit > 0
        // 当前利润售价
        item.profitRate = item.profit / item.sPriceRmb * 100
        // 0 - 30利润率售价
        for (let k = 0; k <= 30; k += 5) {
          item[`pRate_${k}`] = calProfitRate(k / 100)
        }
        item = beautify(item)
        v.list.push(item)
      } else {
        let prd = item.pRate_defalut
        items.push(prd ? currencySymbol + ' ' + prd : '-')
      }

      function calProfitRate(rate) {
        let f = item.logFirst
        let s = item.logSecondRmb
        let result = (pPrice + f + s) / exRate / (1 - factorSC - rate)
        return isNaN(result) ? result : result.toFixed(DIGITS)
      }
    })
    if (!sellPriceOnly) {
      items.push(v)
    }
  })
  // console.log(items)
  return items
}

function beautify(item) {
  let keys = [
    'pPrice',
    'sPrice',
    'logFirst',
    'sPriceRmb',
    'logSecond',
    'logSecondRmb',
    'costSell',
    'cost',
    'profit',
    'profitRate'
  ]
  keys.forEach(v => {
    let val = item[v]
    if (!isNaN(val)) {
      item[v] = val.toFixed(DIGITS)
    }
  })
  return item
}

function calLog(weight, list) {
  weight = parseFloat(weight) || 0
  let total = 0
  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    let sw = parseFloat(item.start_weight) || 0
    let ew = parseFloat(item.end_weight) || Infinity
    if (weight >= sw && weight < ew) {
      // console.log(weight)
      // console.log(item)
      let priceUnit = parseFloat(item.price_unit)
      let priceWeight = parseFloat(item.price_weight)
      let extraCharge = parseFloat(item.extra_charge) || 0
      if (priceUnit) {
        total = priceUnit + extraCharge
      } else if (priceWeight) {
        total = weight * priceWeight + extraCharge
      } else {
        // 价格有误
        total = NaN
      }
      break
    }
    // 不在区间
    if (i === list.length - 1) {
      total = NaN
    }
  }
  // console.log(total)
  return total
}

function calWeight(weight, bulk, rate) {
  let weightReal = weight / 1000 || 0
  let weightBulk = bulk / rate || 0
  // console.log(weightReal + '---')
  // console.log(weightBulk)
  return Math.round(Math.max(weightReal, weightBulk) * 100000) / 100000
}

export default {
  cal,
  lowest
}
