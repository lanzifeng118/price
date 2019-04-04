const logistics = {
  '1': '国内小包',
  '2': '外仓海运',
  '3': '外仓空运',
  '4': 'FBA海运',
  '5': 'FBA空运',
  '6': 'FBW海运',
  '7': 'FBW海运',
}

const localData = [
  {
    type: '1',
    name: 'Ebay',
    logistics: ['1', '2', '3']
  },
  {
    type: '2',
    name: 'Amazon',
    logistics: ['1', '4', '5', '2', '3']
  },
  {
    type: '3',
    name: 'Wish',
    logistics: ['1', '6', '7', '2', '3']
  }
]
const localMapAll = turnObj2(localData)
function turnObj2(arr) {
  const map = {}
  arr.forEach(v => {
    map[v.type] = v
  })
  return map
}

const DIGITS = 2
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
  // console.log('product-----', product)
  // console.log('zone-----', zone)
  // console.log('factor-----', factor)
  const { weight: pWeight, bulk: pBulk } = product
  
  // 根据体积系数计算重量
  const weight = calWeight(pWeight, pBulk, factor.weight_1)
  const weightLocal = calWeight(pWeight, pBulk, factor.weight_2)
  // console.log('weight-----', weight, weightLocal)
  
  const items = []
  zone.forEach(v => {
    v.list = []
    // 地区名称、汇率、单价、采购价、售卖价
    const { currency_symbol: currencySymbol } = v
    const zoneName = v.name.toLowerCase()
    const exRate = parseFloat(v.exchange_rate)
    const pPrice = parseFloat(product.purchase_price)
    const sPrice = parseFloat(product.selling_price)

    const logs = localMapAll[product.local].logistics
    const { category } = product
      // console.log(logs)
    logs.forEach(logType => {
      let item = { logName: logistics[logType] }
      if (logType === '1') {
        // 国内小包
        // console.log(zoneName)
        item.logFirst = calLog(weight, domestic[zoneName])
        item.logSecond = 0
      } else {
        if (logType === '2' || logType === '4' || logType === '6') {
          // 海运
          let priceSea
          switch (logType) {
            case '2':
              priceSea = parseFloat(v.price_sea)
              break;
            case '4':
              priceSea = parseFloat(v.fba_price_sea)
              break;
            case '6':
              priceSea = parseFloat(v.fbw_price_sea)
              break;
          }
          item.logFirst = priceSea * weight
        } else {
          let priceAir, priceAirEm
          switch (logType) {
            case '3':
              priceAir = parseFloat(v.price_air)
              priceAirEm = parseFloat(v.price_air_em)
              break;
            case '5':
              priceAir = parseFloat(v.fba_price_air)
              priceAirEm = parseFloat(v.fba_price_em)
              break;
            case '7':
              priceAir = parseFloat(v.fbw_price_air)
              priceAirEm = parseFloat(v.fbw_price_em)
              break;
          }
          // 外仓空运
          if (category === '2' || category === '3') {
            // 带电带磁
            item.logFirst = priceAirEm * weight
          } else {
            item.logFirst = priceAir * weight
          }
        }
        // TODO: 外仓空运、外仓海运

        item.logSecond = calLog(weightLocal, local[zoneName])
      }

      const { sell_cost: sellCost } = factor // 销售成本系数

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
        item.costSell = item.sPriceRmb * sellCost
        // 总成本
        item.cost =
          pPrice + item.costSell + item.logFirst + item.logSecondRmb
        // 毛利润
        item.profit = item.sPriceRmb - item.cost
        // 是否盈利
        item.earn = item.profit > 0
        // 当前利润售价
        item.profitRate = (item.profit / item.sPriceRmb) * 100
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
        let result = (pPrice + f + s) / exRate / (1 - sellCost - rate)
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

// 计算物流价格
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
/**
 * 计算重量
 * @param { Number } weight   重量
 * @param { Number } bulk     体积
 * @param { Number } rate     体积系数
 */
function calWeight(weight, bulk, rate) {
  // console.log(weight, bulk, rate)
  const weightReal = weight / 1000 || 0
  const weightBulk = bulk / rate || 0
  // console.log(weightReal + '---')
  // console.log(weightBulk)
  return Math.round(Math.max(weightReal, weightBulk) * 100000) / 100000
}

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
  const { product, zone, factor, local } = data

  const items = []
  const titles = ['SKU']
  const localType = '1'

  zone.forEach(v => {
    localMapAll[localType].logistics.forEach(vL => {
      titles.push(v.name + '-' + logistics[vL])
    })
  })

  product.list.forEach(v => {
    let arr = [v.sku]
    v.local = localType
    const domestic = data[`domestic_${v.category}`]
    arr = arr.concat(cal(v, zone, factor, domestic, local, profitRate))
    items.push(arr)
  })
  return backend ? [titles].concat(items) : { titles, items }
}


export default {
  cal,
  lowest
}
