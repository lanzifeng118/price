<script>
let calUrl = '/price/calculation'
let searchUrl = '/price/costinfo'
let zoneUrl = '/binheng/api/zone'
let domesticUrl = '/binheng/api/logistics'

/**
导入
/binheng/domestic/in/normal
/binheng/domestic/in/electric
/binheng/domestic/in/magnetism
/binheng/domestic/in/oversize

导出
/binheng/domestic/out/normal
/binheng/domestic/out/electric
/binheng/domestic/out/magnetism
/binheng/domestic/out/oversize

增删改查
/binheng/domestic/change
data: {
  method: 'post',
  data: {
    type: '1', // 1: normal 2: electric 3: magnetism 4: oversize
  }
}
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
// let queryByIdFun = (url, id) => {
//   return {
//     method: 'post',
//     url: url,
//     data: {
//       method: 'queryById',
//       data: {
//         id: id
//       }
//     }
//   }
// }

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
let saveFun = (url, data) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'save',
      data: data
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
  inNormal(data) {
    return uploadFun('/binheng/api/upload', data)
  },
  inElectric(data) {
    return uploadFun('/binheng/api/upload', data)
  },
  cal: {
    query() {
      return queryFun(calUrl)
    },
    save(data) {
      return saveFun(calUrl, data)
    },
    update(data) {
      return updateFun(calUrl, data)
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
  }
}
export default api
</script>
