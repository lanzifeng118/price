<script>
let calUrl = '/price/calculation'
let searchUrl = '/price/costinfo'
let zoneUrl = '/binheng/api/zone'
let logisticsUrl = '/binheng/api/logistics'

let queryFun = url => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'query'
    }
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
// let queryByClassifyFun = (url, classify) => {
//   return {
//     method: 'post',
//     url: url,
//     data: {
//       method: 'queryByClassify',
//       data: {
//         classify: classify,
//         lang: LANG
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
// let updateForDisplayFun = (url, data) => {
//   return {
//     method: 'post',
//     url: url,
//     data: {
//       method: 'updateForDisplay',
//       data: data
//     }
//   }
// }
let deleteFun = (url, ids) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'delete',
      data: {
        ids: ids.toString()
        // ids: ids
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
let api = {
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
  logistics: {
    query() {
      return queryFun(logisticsUrl)
    },
    insert(data) {
      return insertFun(logisticsUrl, data)
    },
    delete(ids) {
      return deleteFun(logisticsUrl, ids)
    },
    update(data) {
      return updateFun(logisticsUrl, data)
    }
  }
}
export default api
</script>
