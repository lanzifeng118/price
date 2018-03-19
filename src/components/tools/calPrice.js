const DIGITS = 2
let logOrder = ['国内小包', '海运小包', '空运小包']
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

    logOrder.forEach((vL, iL) => {
      let item = {}
      item.logType = vL
      if (iL === 0) {
        // 国内小包
        // console.log(zoneLow)
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
      // 售价
      item.sPrice = sPrice
      // 采购成本
      item.pPrice = pPrice
      // 售价 人民币
      item.sPriceRmb = sPrice * exRate
      // 二程成本(人民币）
      item.logSecondRmb = item.logSecond * exRate
      // 预设利润售价
      item.pRate_defalut = calProfitRate(profitRate / 100)

      if (!sellPriceOnly) {
        // 销售成本
        item.costSell = item.sPriceRmb * factorSC
        // 总成本
        item.cost = pPrice + item.costSell + item.logFirst + item.logSecondRmb
        // 毛利润
        item.profit = item.sPriceRmb - item.cost
        // 是否盈利
        item.earn = item.profit > 0
        // 当前利润
        item.profitRate = item.profit / item.sPriceRmb * 100
        for (let k = 0; k <= 30; k += 5) {
          item[`pRate_${k}`] = calProfitRate(k / 100)
        }
        item = beautify(item)
        v.list.push(item)
      } else {
        let prd = item.pRate_defalut
        items.push(prd ? v.currency_symbol + ' ' + prd : prd)
      }

      function calProfitRate(rate) {
        let f = item.logFirst
        let s = item.logSecondRmb
        let result = (pPrice + f + s) / exRate / (1 - factorSC - rate)
        result = isNaN(result) ? result : result.toFixed(DIGITS)
        return result
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
  return Math.round(Math.max(weightReal, weightBulk) * 100000) / 100000
}

export default {
  cal
}
