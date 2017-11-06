var Cache = {}
Cache.install = function (Vue, options) {
  let cache = {}
  Vue.http.interceptors.push((request, next) => {
    // console.log(Vue.http)
    // 处理URL
    let URL = request.url
    Object.keys(request.params).forEach(function (key) {
      URL = URL.replace(`{${key}}`, request.params[key])
    })
    let Body = cache[URL]
    // =================================
    // 日志日志日志日志日志日志日志日志日志日志
    if (Body === undefined) {
      console.log('缓存未命中...')
    } else {
      console.log('缓存命中：' + URL)
      console.log(Body)
    }
    // =================================

    // 清除缓存
    if (request.clear === true) {
      delete cache[URL]
      next(request.respondWith(Body, {
        status: 200,
        statusText: 'OK'
      }))
    }
    // 输出缓存
    if (Body !== undefined && request.method === 'GET') {
      next(request.respondWith(Body, {
        status: 200,
        statusText: 'OK'
      }))
    } else {
      // 拦截Respone
      next((response) => {
        // 执行缓存GET操作
        if (request.method === 'GET' && request.cache !== false) {
          cache[URL] = response.body
        }
      })
    }
  })
}
module.exports = Cache

