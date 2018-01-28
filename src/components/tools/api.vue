<script>
let calUrl = '/price/calculation'
let searchUrl = '/price/costinfo'

let queryFun = (url, pageData) => {
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
// let deleteFun = (url, ids) => {
//   return {
//     method: 'post',
//     url: url,
//     data: {
//       method: 'delete',
//       data: {
//         ids: ids.toString()
//       }
//     }
//   }
// }
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
let api = {
  cal: {
    query(data) {
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
  }
}
export default api
</script>
