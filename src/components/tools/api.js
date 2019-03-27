let inGoodsUrl = '/binheng/api/goods/in'

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

let methodFun = (method, url, data) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: method,
      data: data
    }
  }
}

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
let queryBySkuFun = (url, data) => {
  return methodFun('queryBySku', url, data)
}

let updateFun = (url, data) => {
  return methodFun('update', url, data)
}

let updateBySkuFun = (url, data) => {
  return methodFun('updateBySku', url, data)
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
  return methodFun('insert', url, data)
}
let uploadFun = (url, data) => {
  return {
    method: 'post',
    url: url,
    headers: { 'content-type': 'multipart/form-data' },
    data: data
  }
}

let api = {
  inProduct(data) {
    return uploadFun(inGoodsUrl, data)
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
