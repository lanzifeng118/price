let UTIL = {};
UTIL.title = function (title) {
    title = title ? title + ' - UED工具平台' : 'UED工具平台';
    window.document.title = title
};

UTIL.GetQueryString = function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = decodeURI(window.location.search.substr(1)).match(reg);
    if (r != null) return unescape(r[2]);
    return null
};

UTIL.getVideoInfo = function (file) {
    return new Promise(resolve => {
        const objectUrl = window.URL.createObjectURL(file);
        const video = document.createElement('video');
        video.addEventListener('loadeddata', function () {
            let width = video.videoWidth;
            let height = video.videoHeight;
            let w = 0;
            let h = 0;

            if (width / height >= 320 / 180) {
                w = 320;
                h = Math.floor((320 / width) * height)
            } else {
                w = Math.floor((180 / height) * width);
                h = 180
            }

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, width, height, 0, 0, w, h);
            resolve({width, height, cover: canvas.toDataURL('image/jpeg')});
            window.URL.revokeObjectURL(objectUrl)
        });
        video.src = objectUrl
    })
};

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
UTIL.getMenuByRouter = function (list) {
    let res = [];
    list.forEach(item => {
        if (item.meta && item.meta.showInMenu) {
            res.push({
                path: item.path,
                name: item.name,
                meta: item.meta,
            });
        }
    });
    return res
};

export default UTIL

/**
 * 创建一个对像，用一个数组的值作为其键名，另一个数组的值作为其值
 * @param keys
 * @param values
 */
function arrayCombine(keys = [], values = []) {
    let obj = {};
    keys.forEach((key, i) => {
        obj[key] = values[i]
    });
    return obj
}

/**
 * 默认构建方法，首行作为字段
 * @param cols  数据表列信息
 * @param rows  数据表内容
 * @returns {*} 构建后的数据
 */
function excel2json(cols, rows) {
    let fields = cols.map(col => col.name);
    return rows.map(row => arrayCombine(fields, row))
}

/**
 * Table 转 JSON 字符串
 * @param table dom节点
 * @returns {string}
 */
function table2json(table) {
    let data = Array.from(table.rows).map(tr =>
        Array.from(tr.cells).map(td => td.innerText)
    );
    data.shift(); // 移除第一行
    return JSON.stringify(data)
}

window.excel2json = excel2json;
window.table2json = table2json;


