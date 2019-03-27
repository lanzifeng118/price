let inGoodsUrl = '/binheng/api/goods/in'

let dInNormalUrl = '/binheng/api/domestic/in/normal'
let dInElectricUrl = '/binheng/api/domestic/in/electric'
let dInMagnetismUrl = '/binheng/api/domestic/in/magnetism'
let dInOversizeUrl = '/binheng/api/domestic/in/oversize'

let lInEbayUrl = '/binheng/api/local/in/ebay'
let lInAmazonUrl = '/binheng/api/local/in/amazon'

/**
导出
/binheng/domestic/out/normal
/binheng/domestic/out/electric
/binheng/domestic/out/magnetism
/binheng/domestic/out/oversize
 */

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
  lInEbay(data) {
    return uploadFun(lInEbayUrl, data)
  },
  lInAmazon(data) {
    return uploadFun(lInAmazonUrl, data)
  }
}
export default api
