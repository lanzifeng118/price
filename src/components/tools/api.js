let calUrl = '/binheng/api/calculation'
let searchUrl = '/price/costinfo'
let zoneUrl = '/binheng/api/zone'

let productUrl = '/binheng/api/goods'

let factorUrl = '/binheng/api/factor'

let domesticUrl = '/binheng/api/domestic/change'
let dInNormalUrl = '/binheng/api/domestic/in/normal'
let dInElectricUrl = '/binheng/api/domestic/in/electric'
let dInMagnetismUrl = '/binheng/api/domestic/in/magnetism'
let dInOversizeUrl = '/binheng/api/domestic/in/oversize'

let localUrl = '/binheng/api/local/change'
let lInEbayUrl = '/binheng/api/local/in/ebay'
let lInAmazonUrl = '/binheng/api/local/in/amazon'

/**
导出
/binheng/domestic/out/normal
/binheng/domestic/out/electric
/binheng/domestic/out/magnetism
/binheng/domestic/out/oversize
 */

let queryFun = (url, pageData) => {
  let data = {
    method: 'query'
  }
  if (pageData) {
    data.data = pageData
  }
  return {
    method: 'post',
    url: url,
    data: data
  }
}
let queryBySkuFun = (url, sku) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'queryBySku',
      data: {
        sku: sku
      }
    }
  }
}

let updateFun = (url, data) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'update',
      data: data
    }
  }
}

let updateBySkuFun = (url, data) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'updateBySku',
      data: data
    }
  }
}

let deleteFun = (url, ids) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'delete',
      data: {
        ids: ids.toString()
      }
    }
  }
}
let insertFun = (url, data) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'insert',
      data: data
    }
  }
}
let uploadFun = (url, data) => {
  return {
    method: 'post',
    url: url,
    headers: {'content-type': 'multipart/form-data'},
    data: data
  }
}

let api = {
  cal: {
    query(data) {
      return queryFun(calUrl, data)
    }
  },
  product: {
    query() {
      return queryFun(productUrl)
    },
    queryBySku(sku) {
      return queryBySkuFun(productUrl, sku)
    },
    insert(data) {
      return insertFun(productUrl, data)
    },
    delete(ids) {
      return deleteFun(productUrl, ids)
    },
    update(data) {
      return updateFun(productUrl, data)
    },
    updateBySku(data) {
      return updateBySkuFun(productUrl, data)
    }
  },
  search: {
    query(sku) {
      return {
        method: 'post',
        url: searchUrl,
        data: {
          method: 'query',
          data: {
            sku: sku
          }
        }
      }
    }
  },
  zone: {
    query() {
      return queryFun(zoneUrl)
    },
    insert(data) {
      return insertFun(zoneUrl, data)
    },
    delete(ids) {
      return deleteFun(zoneUrl, ids)
    },
    update(data) {
      return updateFun(zoneUrl, data)
    }
  },
  factor: {
    query() {
      return queryFun(factorUrl)
    },
    update(data) {
      return updateFun(factorUrl, data)
    }
  },
  domestic: {
    query(data) {
      return queryFun(domesticUrl, data)
    },
    insert(data) {
      return insertFun(domesticUrl, data)
    },
    delete(ids) {
      return deleteFun(domesticUrl, ids)
    },
    update(data) {
      return updateFun(domesticUrl, data)
    }
  },
  dInNormal(data) {
    return uploadFun(dInNormalUrl, data)
  },
  dInElectric(data) {
    return uploadFun(dInElectricUrl, data)
  },
  dInMagnetism(data) {
    return uploadFun(dInMagnetismUrl, data)
  },
  dInOversize(data) {
    return uploadFun(dInOversizeUrl, data)
  },
  local: {
    query(data) {
      return queryFun(localUrl, data)
    },
    insert(data) {
      return insertFun(localUrl, data)
    },
    delete(ids) {
      return deleteFun(localUrl, ids)
    },
    update(data) {
      return updateFun(localUrl, data)
    }
  },
  lInEbay(data) {
    return uploadFun(lInEbayUrl, data)
  },
  lInAmazon(data) {
    return uploadFun(lInAmazonUrl, data)
  }
}
export default api